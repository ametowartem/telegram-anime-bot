import { Inject, Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { SceneContext } from 'telegraf/typings/scenes';
import { Context, Markup } from 'telegraf';
import { IAnime } from '../interface/anime.interface';
import { SubscriptionEntity } from '../../subscription/subscription.entity';
import { REDIS_PROVIDER } from '../../core/core.provider';
import IORedis from 'ioredis';
import { SubscriptionService } from '../../subscription/subscription.service';
import { TelegramService } from '../telegram.service';

@Injectable()
@Scene('deleteSubscription')
export class DeleteSubscriptionScene {
  @Inject(REDIS_PROVIDER)
  private readonly redis: IORedis;
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly telegramService: TelegramService,
  ) {}

  @SceneEnter()
  async chooseAnime(@Ctx() ctx: SceneContext) {
    await this.telegramService.sendAnimeTitle(ctx.from.id, ctx);
    const menu = Markup.keyboard([[Markup.button.text('🔙')]]).oneTime();
    await ctx.reply('Выбери аниме для удаления подписки ', menu);
  }

  @Hears('🔙')
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.reply('Отменил выбор аниме');
    await ctx.scene.leave();
    await this.telegramService.start(ctx);
  }

  @Action(/\w*\d\w*/)
  async onAnswer(@Ctx() ctx: Context & any) {
    ctx.answerCbQuery('удаляю подписку');

    const uuid = ctx.callbackQuery.data;

    await this.subscriptionService.delete(uuid, ctx);
  }
}
