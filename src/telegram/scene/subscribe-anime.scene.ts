import { Action, Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { nanoid } from 'nanoid/non-secure';
import { Context, Markup } from 'telegraf';
import { SubscriptionEntity } from '../../subscription/subscription.entity';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';
import { SubscriptionService } from '../../subscription/subscription.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { IEpisode } from '../interface/episode.interface';

@Injectable()
@Scene('subscribeAnime')
export class SubscribeAnimeScene {
  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;

  constructor(private readonly subscriptionService: SubscriptionService) {}

  @SceneEnter()
  async choseAnime(@Ctx() ctx: SceneContext) {
    await ctx.reply('Ну выбирай свою анимешку друг');
  }

  @On('text')
  async reply(@Ctx() ctx: SceneContext, @Message() message) {
    const foundAnime = await this.subscriptionService.getAnimeUrl(message.text);
    await ctx.reply('Смотри че нашел, другалёк)');

    if (!foundAnime.length) {
      await ctx.reply('а ниче не нашел');
      return;
    }

    const inlineValue = foundAnime.map((el) => {
      const urlKey = nanoid(6);
      this.redis.set(urlKey, JSON.stringify({ url: el.href, name: el.name }));
      return [{ text: el.name, callback_data: urlKey }];
    });

    const inlineButtons = Markup.inlineKeyboard(inlineValue);
    await ctx.replyWithHTML('наблюдай', inlineButtons);
  }

  @Action(/\w*\d\w*/)
  async onAnswer(@Ctx() ctx: Context & any) {
    ctx.answerCbQuery('подписываюсь на анимешку');

    const urlKey = ctx.callbackQuery.data;
    const { url, name } = JSON.parse(await this.redis.get(urlKey)) as IEpisode;

    await this.subscriptionService.save(
      new SubscriptionEntity(ctx.callbackQuery.from.id, url, name),
      ctx,
    );
  }
}
