import kafkaClient, { SUBMIT_TOPIC } from '@repo/kafka/client';

// need to take input from the kafka queue and process it
async function main() {
  if (!SUBMIT_TOPIC) {
    console.error('No topic name provided, exiting.');
    return;
  }
  try {
    await kafkaClient.createTopic(SUBMIT_TOPIC);

    const consumer = kafkaClient
      .getInstance()
      .consumer({ groupId: 'engine-group' });
    await consumer.connect();

    await consumer.subscribe({ topic: SUBMIT_TOPIC, fromBeginning: false });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value?.toString() || '{}');
      },
    });
  } catch (error) {
    console.error(error);
  }
}

main();
