import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { SubscriptionEntity } from "./subscription/subscription.entity";

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [SubscriptionEntity],
  migrations: ['./src/migrations/*.ts'],
});
