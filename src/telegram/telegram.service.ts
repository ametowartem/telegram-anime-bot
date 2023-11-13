import { Inject, Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { SubscriptionService } from '../subscription/subscription.service';
import { IAnime } from './interface/anime.interface';
import { nanoid } from 'nanoid/non-secure';
import { REDIS_PROVIDER } from '../core/core.provider';
import IORedis from 'ioredis';
import { SubscriptionEntity } from '../subscription/subscription.entity';

@Injectable()
export class TelegramService {
  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async start(ctx: Context) {
    const menu = Markup.keyboard([
      [Markup.button.text('❤')],
      [Markup.button.text('📖')],
      [Markup.button.text('❌')],
    ]).oneTime();
    await ctx.reply(
      '1. подписаться на аниме\n2. получить список подписок\n3. Отписаться от аниме',
      menu,
    );
  }

  async sendUserSubscriptions(ctx: Context) {
    const userSubscriptions =
      await this.subscriptionService.getSubscriptionsGroupByUser(ctx.from.id);

    const inlineValue = userSubscriptions.map((el) => {
      return [Markup.button.url(`${el.animeName}`, el.animeUrl)];
    });

    const inlineButtons = Markup.inlineKeyboard(inlineValue);
    await ctx.replyWithHTML('Список подписок', inlineButtons);
  }

  async sendAnimeUrl(animes, ctx: Context) {
    const inlineValue = [];
    for (const anime of animes) {
      const status = await this.subscriptionService.checkAnimeByUser(
        ctx.from.id,
        anime.name,
      );
      const urlKey = nanoid(6);
      this.redis.set(
        urlKey,
        JSON.stringify({ url: anime.url, name: anime.name }),
      );

      inlineValue.push([
        Markup.button.callback(anime.name, urlKey),
        Markup.button.callback(status ? '✅' : '📛', urlKey),
      ]);
    }

    const inlineButtons = Markup.inlineKeyboard(inlineValue);
    await ctx.reply('Список аниме: ', inlineButtons);
  }

  async sendAnimeTitle(userUuid, ctx: Context) {
    const animes = await this.subscriptionService.getSubscriptionsGroupByUser(
      userUuid,
    );
    const inlineValue = animes.map((el: SubscriptionEntity) => {
      // const urlKey = nanoid(6);
      // this.redis.set(urlKey, JSON.stringify({ name: el., name: el.name }));
      return [{ text: el.animeName, callback_data: el.uuid }];
    });

    const inlineButtons = Markup.inlineKeyboard(inlineValue);
    await ctx.reply('Список аниме: ', inlineButtons);
  }
}
