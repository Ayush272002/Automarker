import kafkaClient from '@repo/kafka/client';
import { SUBMIT } from '@repo/topics/topics';
import dotenv from 'dotenv';
import { processSubmission } from './utils/submission';

dotenv.config();

const topic = SUBMIT;

async function consumeMessages() {
  try {
    const kafka = kafkaClient.getInstance();
    const consumer = kafka.consumer({ groupId: 'assignment-submission' });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      //   @ts-ignore
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString() || '';
        console.log(`Received message: ${messageValue}`);
        try {
          const submission = JSON.parse(messageValue);
          await processSubmission(submission);
        } catch (err) {
          console.log('Error processing message:', err);
        }
      },
    });

    console.log(`Consuming messages from topic "${topic}"...`);
  } catch (error) {
    console.error('Error in Kafka Consumer:', error);
  }
}

consumeMessages();
