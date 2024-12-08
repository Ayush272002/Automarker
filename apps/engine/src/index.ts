import kafkaClient from '@repo/kafka/client';
import { SUBMIT } from '@repo/topics/topics';
import dotenv from 'dotenv';
import { sshIntoEC2 } from './utils/ssh';

dotenv.config();

const topic = SUBMIT;

async function consumeMessages() {
  try {
    const kafka = kafkaClient.getInstance();
    const consumer = kafka.consumer({ groupId: 'your-consumer-group-id' });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      //   @ts-ignore
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString() || '';
        console.log(`Received message: ${messageValue}`);
      },
    });

    console.log(`Consuming messages from topic "${topic}"...`);
  } catch (error) {
    console.error('Error in Kafka Consumer:', error);
  }
}

// consumeMessages();
sshIntoEC2();
