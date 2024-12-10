import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import prisma from '@repo/db/client';

async function convertLineEndings(ssh: NodeSSH, filePath: string) {
  const result = await ssh.execCommand(`
    if command -v dos2unix >/dev/null 2>&1; then
      dos2unix ${filePath}
    else
      sed -i 's/\r$//' ${filePath}
    fi
  `);

  if (result.code !== 0) {
    console.error('Failed to convert line endings:', result.stderr);
    throw new Error('Failed to convert line endings');
  }
}

export async function processSubmission(submission: any) {
  const { assignmentId, uploadLink, markingScript, dockerFile } = submission;

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

    // Download and validate sol.js
    console.log('Downloading submission on EC2...');
    const downloadSubmission = `curl -o ${remoteWorkDir}/sol.js '${uploadLink}'`;
    await ssh.execCommand(downloadSubmission);

    const validateSubmission = `test -f ${remoteWorkDir}/sol.js && echo "File exists" || echo "File missing"`;
    const submissionCheck = await ssh.execCommand(validateSubmission);
    if (!submissionCheck.stdout.includes('File exists')) {
      throw new Error('Failed to download sol.js');
    }
    console.log('Submission file downloaded and renamed to sol.js.');

    // Download and validate mark.sh
    console.log('Downloading marking script...');
    const downloadMarkingScript = `curl -o ${remoteWorkDir}/mark.sh '${markingScript}'`;
    await ssh.execCommand(downloadMarkingScript);
    await ssh.execCommand(`chmod +x ${remoteWorkDir}/mark.sh`);

    console.log('Converting line endings...');
    await convertLineEndings(ssh, `${remoteWorkDir}/mark.sh`);

    const validateMarkingScript = `test -f ${remoteWorkDir}/mark.sh && echo "File exists" || echo "File missing"`;
    const markingScriptCheck = await ssh.execCommand(validateMarkingScript);
    if (!markingScriptCheck.stdout.includes('File exists')) {
      throw new Error('Failed to download mark.sh');
    }
    console.log(
      'Marking script downloaded, made executable, and line endings converted.'
    );

    // Download and validate Dockerfile
    console.log('Downloading Dockerfile...');
    const downloadDockerFile = `curl -o ${remoteWorkDir}/Dockerfile '${dockerFile}'`;
    await ssh.execCommand(downloadDockerFile);

    const validateDockerFile = `test -f ${remoteWorkDir}/Dockerfile && echo "File exists" || echo "File missing"`;
    const dockerFileCheck = await ssh.execCommand(validateDockerFile);
    if (!dockerFileCheck.stdout.includes('File exists')) {
      throw new Error('Failed to download Dockerfile');
    }
    console.log('Dockerfile downloaded.');

    // Build Docker image
    console.log('Building Docker image...');
    const imageName = `assignment_${assignmentId}:latest`;
    const buildCommand = `cd ${remoteWorkDir} && sudo docker build -t ${imageName} .`;
    const buildResult = await ssh.execCommand(buildCommand);

    if (buildResult.code !== 0) {
      console.error('Build errors:', buildResult.stderr);
      throw new Error(
        'Docker build failed. Check the Dockerfile or input files.'
      );
    }
    console.log(`Docker image ${imageName} built successfully.`);
    console.log('Build output:', buildResult.stdout, buildResult.stderr);

    // Run Docker container
    console.log('Running Docker container...');
    const containerName = `assignment_${assignmentId}_container`;
    const runCommand = `sudo docker run --name ${containerName} ${imageName}`;
    const runResult = await ssh.execCommand(runCommand);
    console.log('Container output:', runResult.stdout);
    if (runResult.stderr) console.error('Container errors:', runResult.stderr);

    // Process results
    console.log('Validating test results from container output...');
    const testsOutput = runResult.stdout || '';
    const passedTestsMatch = testsOutput.match(/Number of tests passed: (\d+)/);
    const passedTests = passedTestsMatch ? parseInt(passedTestsMatch[1]!) : 0;
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

// sudo apt-get update && sudo apt-get install -y dos2unix
