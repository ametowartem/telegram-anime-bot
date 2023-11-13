import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionRepository } from './subscription.repository';
import { Context } from 'telegraf';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async save(subscription: SubscriptionEntity, ctx: Context) {
    try {
      await this.subscriptionRepository.save(subscription);
      await ctx.reply(`Успешно подписался на аниме: ${subscription.animeName}`);
    } catch (err) {
      await ctx.reply(`Подписка на это аниме уже оформлена`);
    }
  }

  async delete(uuid, ctx: Context) {
    try {
      const subscription = await this.subscriptionRepository.findOneBy({
        uuid,
      });
      await this.subscriptionRepository.delete(subscription);
      await ctx.reply(`Успешно отписался от аниме: ${subscription.animeName}`);
    } catch (err) {
      await ctx.reply(`Не удалось отписаться от аниме: подписка не оформлена`);
    }
  }

  async getSubscriptionsGroupByAnime(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.getSubscriptionsGroupByAnime();
  }

  async getSubscriptionsGroupByUser(userUuid): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.getSubscriptionsGroupByUser(
      userUuid,
    );
  }

  async checkAnimeByUser(userUuid, animeName): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.checkAnimeByUser(
      userUuid,
      animeName,
    );
  }
}
