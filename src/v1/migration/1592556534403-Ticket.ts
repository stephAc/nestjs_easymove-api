import {MigrationInterface, QueryRunner} from "typeorm";

export class Ticket1592556534403 implements MigrationInterface {
    name = 'Ticket1592556534403'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" double precision NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "rate"`, undefined);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "rate" integer NOT NULL`, undefined);
    }

}
