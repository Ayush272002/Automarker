import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import axios from 'axios';

export async function processSubmission(submission: any) {
  const { assignmentId, uploadLink, environment, testCommand } = submission;

  try {
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `${assignmentId}`);
    console.log(`Temp file path: ${filePath}`);

    console.log('Downloading submission...');
    const response = await axios.get(uploadLink, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('File downloaded successfully:', filePath);

    console.log('Determining file type...');
    let extractPath = path.join(tmpDir, `${assignmentId}_work`);
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    if (filePath.endsWith('.zip')) {
      console.log('Extracting zip file...');
      execSync(`unzip ${filePath} -d ${extractPath}`);
    } else {
      console.log('Processing as a single file...');
      const destinationFilePath = path.join(
        extractPath,
        path.basename(filePath)
      );
      fs.copyFileSync(filePath, destinationFilePath);
    }

    console.log('Creating Dockerfile...');
    const dockerfilePath = path.join(extractPath, 'Dockerfile');
    const dockerfileContent = `
      FROM node:20.12.0-alpine3.19
      WORKDIR /app
      COPY . .
      CMD ["${testCommand}"]
    `;
    fs.writeFileSync(dockerfilePath, dockerfileContent);
    console.log('Dockerfile created successfully.');

    console.log('Building Docker image...');
    const imageName = `assignment_${assignmentId}`;
    execSync(`docker build -t ${imageName} ${extractPath}`);
    console.log(`Docker image ${imageName} built successfully.`);

    console.log('Saving Docker image...');
    const tarPath = path.join(tmpDir, `${imageName}.tar`);
    execSync(`docker save -o ${tarPath} ${imageName}`);
    console.log(`Docker image saved as ${tarPath}`);

    console.log('Transferring Docker image to EC2...');
    const { NodeSSH } = await import('node-ssh');
    const ssh = new NodeSSH();

    const host = process.env.HOST as string;
    const username = 'ubuntu';
    const privateKey = fs.readFileSync(
      process.env.PRIVATE_KEY as string,
      'utf-8'
    );

    console.log('Connecting to EC2 instance...');
    await ssh.connect({ host, username, privateKey });
    console.log('Connected to EC2 instance.');

    const remoteTarPath = `/tmp/${imageName}.tar`;
    await ssh.putFile(tarPath, remoteTarPath);
    console.log('Transferred Docker image to EC2.');

    console.log('Running container on EC2...');
    await ssh.execCommand(`sudo docker load < ${remoteTarPath}`);
    const runCommand = `sudo docker run ${imageName}`;
    const runResult = await ssh.execCommand(runCommand);

    console.log('Container execution complete. Output:');
    console.log(runResult.stdout);
    if (runResult.stderr) console.error('Errors:', runResult.stderr);

    // Clean Up
    console.log('Cleaning up...');
    await ssh.execCommand(`docker rmi ${imageName}`);
    await ssh.execCommand(`rm -f ${remoteTarPath}`);
    ssh.dispose();

    // Local cleanup
    fs.rmSync(filePath);
    fs.rmSync(extractPath, { recursive: true, force: true });
    fs.rmSync(tarPath);

    console.log('Marking complete.');
  } catch (error) {
    console.error('Error processing submission:', error);
  }
}
