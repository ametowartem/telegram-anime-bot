// import { MigrationInterface, QueryRunner } from 'typeorm';
//
// export class CreateAnimeSeason1699284424374 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `
//              CREATE TABLE if not exists anime_season(
//                 uuid uuid DEFAULT uuid_generate_v4() primary key,
//                 anime_url varchar(200) not null unique,
//                 last_episode_date date not null default now()
//              )
//         `,
//     );
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `
//           DROP TABLE if exists anime_season
//       `,
//     );
//   }
// }
