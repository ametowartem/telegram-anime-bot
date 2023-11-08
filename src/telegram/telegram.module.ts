import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '../core/service/config.service';
import { CoreModule } from '../core/core.module';
import { TelegramUpdate } from './update/telegram.update';
import { SubscriptionModule } from '../subscription/subscription.module';
import { telegramMiddleware } from './middleware/telegram.middleware';
import { SubscribeAnimeScene } from "./scene/subscribe-anime.scene";

@Module({
  imports: [
    SubscriptionModule,
    CoreModule,
    TelegrafModule.forRootAsync({
      imports: [CoreModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.telegramToken,
        middlewares: [telegramMiddleware],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramUpdate, SubscribeAnimeScene],
})
export class TelegramModule {}
