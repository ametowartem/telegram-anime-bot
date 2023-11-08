import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_subscription')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'anime_url' })
  animeUrl: string;

  @Column({ name: 'anime_name' })
  animeName: string;

  constructor(
    userUuid: string,
    animeUrl: string,
    animeName: string,
    uuid?: string,
  ) {
    this.uuid = uuid;
    this.userUuid = userUuid;
    this.animeUrl = animeUrl;
    this.animeName = animeName;
  }
}
