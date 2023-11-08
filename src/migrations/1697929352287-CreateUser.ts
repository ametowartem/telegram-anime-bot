import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1697929352287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `,
    );

    await queryRunner.query(
      `
             CREATE TABLE if not exists user_subscription(
                uuid uuid DEFAULT uuid_generate_v4() primary key,
                user_uuid varchar(50) not null ,
                anime_url varchar(200) not null, 
                anime_name varchar(200) not null
             )
        `,
    );

    await queryRunner.query(
      `
            ALTER TABLE user_subscription
            ADD CONSTRAINT __unique__user__anime__ UNIQUE (user_uuid, anime_url);
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DROP TABLE if exists user_subscription
      `,
    );
  }
}
