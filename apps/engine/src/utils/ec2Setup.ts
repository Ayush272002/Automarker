import { NodeSSH } from 'node-ssh';

export async function installDos2unix(ssh: NodeSSH) {
  console.log('Installing dos2unix...');
  const result = await ssh.execCommand(
    'sudo apt-get update && sudo apt-get install -y dos2unix'
  );
  if (result.code !== 0) {
    console.error('Failed to install dos2unix:', result.stderr);
    throw new Error('Failed to install dos2unix');
  }
  console.log('dos2unix installed successfully.');
}

export async function installDocker(ssh: NodeSSH) {
  console.log('Installing Docker...');
  const commands = [
    'sudo apt-get update',
    'sudo apt-get install -y ca-certificates curl',
    'sudo install -m 0755 -d /etc/apt/keyrings',
    'sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc',
    'sudo chmod a+r /etc/apt/keyrings/docker.asc',
    'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
    'sudo apt-get update',
    'sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin',
  ];

  for (const command of commands) {
    const result = await ssh.execCommand(command);
    if (result.code !== 0) {
      console.error(`Failed to execute command: ${command}`);
      console.error('Error:', result.stderr);
      throw new Error('Failed to install Docker');
    }
  }
  console.log('Docker installed successfully.');
}
