import fs from 'fs';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

export async function sshIntoEC2() {
  try {
    const privateKeyPath = process.env.PRIVATE_KEY as string;
    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    const host = process.env.HOST as string;
    const username = process.env.USERNAME as string;

    console.log('Connecting to EC2 instance...');
    await ssh.connect({
      host,
      username,
      privateKey,
    });

    console.log('Connected to EC2 instance.');

    await ssh.execCommand('cd');
    await ssh.execCommand('touch test.txt');
    await ssh.execCommand('echo "Hello World" > test.txt');
    await ssh.execCommand('ls -la');

    ssh.dispose();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Failed to SSH into EC2 instance:', error);
  }
}
