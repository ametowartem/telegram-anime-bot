import { Injectable } from '@nestjs/common';
import { EnvConfigConst } from '../const/env-config.const';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { JoiSchema } from '../const/env-config-schema.const';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfigConst;

  constructor() {
    dotenv.config();
    this.envConfig = this.validateInput(process.env);
  }

  validateInput(config: EnvConfigConst): EnvConfigConst {
    const { error, value: validatedEnvConfig } = JoiSchema.validate(config, {
      allowUnknown: true,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get redisPort(): number {
    return Number(this.envConfig.REDIS_PORT);
  }

  get redisExp(): number {
    return Number(this.envConfig.REDIS_EXP);
  }

  get redisHost(): string {
    return String(this.envConfig.REDIS_HOST);
  }

  get databaseType(): string {
    return String(this.envConfig.DATABASE_TYPE);
  }

  get host(): string {
    return String(this.envConfig.HOST);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get databasePort(): number {
    return Number(this.envConfig.DATABASE_PORT);
  }

  get databaseUsername(): string {
    return String(this.envConfig.DATABASE_USERNAME);
  }

  get databasePassword(): string {
    return String(this.envConfig.DATABASE_PASSWORD);
  }

  get databaseName(): string {
    return String(this.envConfig.DATABASE_NAME);
  }

  get databaseHost(): string {
    return String(this.envConfig.DATABASE_HOST);
  }

  get jwtSecret(): string {
    return String(this.envConfig.SECRET);
  }

  get exp(): number {
    return Number(this.envConfig.EXP);
  }

  get saltRounds(): number {
    return Number(this.envConfig.SALT_ROUNDS);
  }

  get telegramToken(): string {
    return String(this.envConfig.TELEGRAM_TOKEN);
  }

  getUserTokenWhiteList(id): string {
    return `user-access-tokens-white-list:${id}`;
  }
}
