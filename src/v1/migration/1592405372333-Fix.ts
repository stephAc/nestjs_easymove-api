import {MigrationInterface, QueryRunner} from "typeorm";

export class Fix1592405372333 implements MigrationInterface {
    name = 'Fix1592405372333'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "navigo_flatrate_enum" AS ENUM('week', 'monthly', 'annual', 'none')`, undefined);
        await queryRunner.query(`CREATE TABLE "navigo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "flatRate" "navigo_flatrate_enum" NOT NULL DEFAULT 'none', "price" character varying NOT NULL, "startedOn" TIMESTAMP NOT NULL DEFAULT NOW(), "finishOn" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_44eb756c5818686b7515f37e75e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "userId" uuid NOT NULL, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "navigoId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_ed7c9d2070a39b60819bbd9ce62" UNIQUE ("navigoId")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ed7c9d2070a39b60819bbd9ce62" FOREIGN KEY ("navigoId") REFERENCES "navigo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ed7c9d2070a39b60819bbd9ce62"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_ed7c9d2070a39b60819bbd9ce62"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "navigoId"`, undefined);
        await queryRunner.query(`DROP TABLE "tickets"`, undefined);
        await queryRunner.query(`DROP TABLE "navigo"`, undefined);
        await queryRunner.query(`DROP TYPE "navigo_flatrate_enum"`, undefined);
    }

}
