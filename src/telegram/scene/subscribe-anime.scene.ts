import {
  Action,
  Command,
  Ctx, Hears,
  Message,
  On,
  Scene,
  SceneEnter
} from "nestjs-telegraf";
import { Context, Markup } from 'telegraf';
import { SubscriptionEntity } from '../../subscription/subscription.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionService } from '../../subscription/subscription.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { IAnime } from '../interface/anime.interface';
import { getAnimeUrl } from '../../subscription/subscription.utils';
import { TelegramService } from '../telegram.service';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';

@Injectable()
@Scene('subscribeAnime')
export class SubscribeAnimeScene {
  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly telegramService: TelegramService,
  ) {}

  @SceneEnter()
  async choseAnime(@Ctx() ctx: SceneContext) {
    const menu = Markup.keyboard([[Markup.button.text('🔙')]]).oneTime();
    await ctx.reply('Пиши название интересующего аниме ', menu);
  }

  @Hears('🔙')
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.reply('Отменил выбор аниме');
    await ctx.scene.leave();
    await this.telegramService.start(ctx);
  }

  @Action(/\w*\d\w*/)
  async onAnswer(@Ctx() ctx: Context & any) {
    ctx.answerCbQuery('подписываюсь на анимешку');

    const urlKey = ctx.callbackQuery.data;
    const { url, name } = JSON.parse(await this.redis.get(urlKey)) as IAnime;

    await this.subscriptionService.save(
      new SubscriptionEntity(ctx.callbackQuery.from.id, url, name),
      ctx,
    );
  }

  @On('text')
  async reply(@Ctx() ctx: SceneContext, @Message() message) {
    const foundAnime = await getAnimeUrl(message.text);

    if (!foundAnime.length) {
      await ctx.reply('извини, по твоему запросу не ничего не найдено ');
      return;
    }

    await this.telegramService.sendAnimeUrl(foundAnime, ctx);
  }
}
