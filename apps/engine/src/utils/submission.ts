import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import prisma from '@repo/db/client';

export async function processSubmission(submission: any) {
  const { assignmentId, uploadLink, markingScript } = submission;

  try {
    console.log('Setting up SSH connection...');
    const ssh = new NodeSSH();

    const host = process.env.HOST;
    const username = 'ubuntu';
    const privateKey = fs.readFileSync(
      process.env.PRIVATE_KEY as string,
      'utf-8'
    );

    await ssh.connect({ host, username, privateKey });
    console.log('Connected to EC2 instance.');

    const remoteWorkDir = `/tmp/${assignmentId}_work`;

    console.log('Creating working directory on EC2...');
    await ssh.execCommand(`mkdir -p ${remoteWorkDir}`);

    console.log('Downloading submission on EC2...');
    const submissionFilePath = `${remoteWorkDir}/submission_file`;
    const downloadSubmission = `curl -o ${submissionFilePath} '${uploadLink}'`;
    await ssh.execCommand(downloadSubmission);
    console.log('Submission file downloaded successfully.');

    console.log('Downloading marking script...');
    const markingScriptPath = `${remoteWorkDir}/mark.sh`;
    const downloadMarkingScript = `curl -o ${markingScriptPath} '${markingScript}'`;
    await ssh.execCommand(downloadMarkingScript);
    await ssh.execCommand(`chmod +x ${markingScriptPath}`);
    console.log('Marking script downloaded and made executable.');

    // Ensure the script has Unix line endings
    await ssh.execCommand(`sed -i 's/\\r$//' ${markingScriptPath}`);

    console.log('Creating Dockerfile...');
    const dockerfileContent = `
        FROM node:alpine
        RUN apk add --no-cache bash
        WORKDIR /app
        COPY --chown=node:node submission_file ./mul.js
        COPY --chown=node:node mark.sh ./mark.sh
        RUN chmod +x mark.sh
        CMD ["bash", "./mark.sh"]
      `;

    await ssh.execCommand(
      `echo '${dockerfileContent}' > ${remoteWorkDir}/Dockerfile`
    );
    console.log('Dockerfile created.');

    console.log('Building Docker image...');
    const imageName = `assignment_${assignmentId}:latest`;
    const buildCommand = `cd ${remoteWorkDir} && sudo docker build -t ${imageName} .`;
    const buildResult = await ssh.execCommand(buildCommand);
    console.log('Build output:', buildResult.stdout);
    if (buildResult.stderr) console.error('Build errors:', buildResult.stderr);
    console.log(`Docker image ${imageName} built.`);

    console.log('Running Docker container...');
    const containerName = `assignment_${assignmentId}_container`;
    const runCommand = `sudo docker run --name ${containerName} ${imageName}`;
    const runResult = await ssh.execCommand(runCommand);
    console.log('Container output:', runResult.stdout);
    if (runResult.stderr) console.error('Container errors:', runResult.stderr);

    console.log('Validating test results from container output...');
    const testsOutput = runResult.stdout || '';

    const passedTestsMatch = testsOutput.match(/Number of tests passed: (\d+)/);
    // @ts-ignore
    const passedTests = passedTestsMatch ? parseInt(passedTestsMatch[1]) : 0;
    const totalTests = 4;

    const marks = Math.round((passedTests / totalTests) * 100);
    console.log(`Tests passed: ${passedTests}/${totalTests}`);
    console.log(`Marks calculated: ${marks}`);

    const submissionRecord = await prisma.submission.findFirst({
      where: { assignmentId },
      select: { id: true },
    });

    if (!submissionRecord) {
      console.error(`Submission not found for assignmentId: ${assignmentId}`);
      return;
    }

    await prisma.submission.update({
      where: { id: submissionRecord.id },
      data: {
        marksAchieved: marks,
        logs: testsOutput,
      },
    });
    console.log('Marks updated in the database.');

    console.log('Cleaning up EC2 resources...');
    await ssh.execCommand(
      `sudo docker stop ${containerName} && sudo docker rm ${containerName}`
    );
    await ssh.execCommand(`sudo docker rmi ${imageName}`);
    await ssh.execCommand(`rm -rf ${remoteWorkDir}`);

    ssh.dispose();
    console.log('Process complete.');
  } catch (error) {
    console.error('Error processing submission:', error);
    throw error;
  }
}
