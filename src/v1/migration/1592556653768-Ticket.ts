import {MigrationInterface, QueryRunner} from "typeorm";

export class Ticket1592556653768 implements MigrationInterface {
    name = 'Ticket1592556653768'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" double precision NOT NULL DEFAULT 2.3`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" integer NOT NULL`, undefined);
    }

}
