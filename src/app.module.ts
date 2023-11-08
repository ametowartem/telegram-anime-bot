import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigService } from './core/service/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from "./subscription/subscription.module";
import { SubscriptionEntity } from "./subscription/subscription.entity";

@Module({
  imports: [
    CoreModule,
    TelegramModule,
    SubscriptionModule,
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [SubscriptionEntity],
        migrations: ['src/migrations'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
