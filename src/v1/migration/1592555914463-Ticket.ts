import {MigrationInterface, QueryRunner} from "typeorm";

export class Ticket1592555914463 implements MigrationInterface {
    name = 'Ticket1592555914463'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" character varying NOT NULL`, undefined);
    }

}
