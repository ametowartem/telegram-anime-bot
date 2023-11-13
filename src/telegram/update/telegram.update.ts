import { Action, Command, Ctx, Hears, Start, Update } from "nestjs-telegraf";
import { Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SubscriptionService } from '../../subscription/subscription.service';
import { TelegramService } from '../telegram.service';

type Context = Scenes.SceneContext;
@Update()
export class TelegramUpdate {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly telegramService: TelegramService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.telegramService.start(ctx);
  }

  @Hears('📖')
  async getUserSubscriptions(@Ctx() ctx: SceneContext) {
    await this.telegramService.sendUserSubscriptions(ctx);
  }

  @Hears('❤')
  async subscribeAnime(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('subscribeAnime');
  }

  @Hears('❌')
  async unsubscribeAnime(@Ctx() ctx: Context) {
    await ctx.scene.enter('deleteSubscription');
  }

  @Hears('🔙')
  async leave(@Ctx() ctx: SceneContext) {
    await this.telegramService.start(ctx);
  }
}
