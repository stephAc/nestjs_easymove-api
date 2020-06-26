import {MigrationInterface, QueryRunner} from "typeorm";

export class userTicket1593212833266 implements MigrationInterface {
    name = 'userTicket1593212833266'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."navigo_flatrate_enum" RENAME TO "navigo_flatrate_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "navigo_flatrate_enum" AS ENUM('WEEK', 'MONTH', 'YEAR', 'NONE')`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" TYPE "navigo_flatrate_enum" USING "flatRate"::"text"::"navigo_flatrate_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" SET DEFAULT 'NONE'`, undefined);
        await queryRunner.query(`DROP TYPE "navigo_flatrate_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" SET DEFAULT 'NONE'`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" SET DEFAULT 'none'`, undefined);
        await queryRunner.query(`CREATE TYPE "navigo_flatrate_enum_old" AS ENUM('week', 'monthly', 'annual', 'none')`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" TYPE "navigo_flatrate_enum_old" USING "flatRate"::"text"::"navigo_flatrate_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "navigo" ALTER COLUMN "flatRate" SET DEFAULT 'NONE'`, undefined);
        await queryRunner.query(`DROP TYPE "navigo_flatrate_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "navigo_flatrate_enum_old" RENAME TO  "navigo_flatrate_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
