import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from '../subscription.service';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import * as moment from 'moment';
import { parseAnimeSeason } from '../subscription.utils';

@Injectable()
export class SubscriptionCronJob {
  private readonly logger = new Logger(SubscriptionCronJob.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async sendAnime() {
    const subscriptions =
      await this.subscriptionService.getSubscriptionsGroupByAnime();

    for (const anime of subscriptions) {
      const animeButtons = [];
      const episodes = await parseAnimeSeason(anime.animeUrl);

      for (const episode of episodes) {
        const dayDiff = moment(new Date().setHours(12, 0, 0, 0)).diff(
          episode.dateRU,
          'day',
        );

        if (dayDiff === 0) {
          animeButtons.push([
            Markup.button.url(
              `${anime.animeName} - ${episode.name}`,
              anime.animeUrl,
            ),
          ]);
        }
      }

      if (animeButtons.length) {
        await this.bot.telegram.sendMessage(
          anime.userUuid,
          'Вышла анимешка',
          Markup.inlineKeyboard(animeButtons),
        );
      }
    }
  }
}
