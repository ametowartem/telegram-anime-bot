import { DataSource, Repository } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionRepository extends Repository<SubscriptionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SubscriptionEntity, dataSource.createEntityManager());
  }

  async getSubscriptionsGroupByAnime(): Promise<SubscriptionEntity[]> {
    return await this.createQueryBuilder('user_subscription')
      .groupBy('user_subscription.anime_url')
      .addGroupBy('user_subscription.uuid')
      .getMany();
  }

  async getSubscriptionsGroupByUser(userUuid): Promise<SubscriptionEntity[]> {
    return await this.createQueryBuilder('user_subscription')
      .groupBy('user_subscription.user_uuid')
      .addGroupBy('user_subscription.uuid')
      .where({ userUuid })
      .getMany();
  }

  async checkAnimeByUser(userUuid, animeName): Promise<SubscriptionEntity> {
    return await this.createQueryBuilder('user_subscription')
      .where({ userUuid })
      .andWhere({ animeName })
      .getOne();
  }
}
