import { RedisClientType, createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export class RedisManager {
  private client: RedisClientType;
  private publisher: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.connect();

    this.publisher = createClient({ url: process.env.REDIS_URL });
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }

    return this.instance;
  }

  public async subscribe(channel: string, callback: (message: string) => void) {
    const subscriber = createClient({ url: process.env.REDIS_URL });
    await subscriber.connect();

    subscriber.subscribe(channel, (message) => {
      //console.log(`Received message: ${message}`);
      callback(message);
    });
  }
}
