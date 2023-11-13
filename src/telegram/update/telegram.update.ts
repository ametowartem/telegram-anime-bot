import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
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

  @Command('getUserSubscriptions')
  async getUserSubscriptions(@Ctx() ctx: SceneContext) {
    await this.telegramService.sendUserSubscriptions(ctx);
  }

  @Command('subscribeAnime')
  async subscribeAnime(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('subscribeAnime');
  }

  @Command('deleteSubscription')
  async unsubscribeAnime(@Ctx() ctx: Context) {
    await ctx.scene.enter('deleteSubscription');
  }

  @Command('leave')
  async leave(@Ctx() ctx: SceneContext) {
    await this.telegramService.start(ctx);
  }
}
