import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionCronJob } from './job/subscription.cron-job';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SubscriptionService, SubscriptionRepository, SubscriptionCronJob],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
