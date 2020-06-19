import {MigrationInterface, QueryRunner} from "typeorm";

export class Ticket1592557960833 implements MigrationInterface {
    name = 'Ticket1592557960833'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" ADD "valid" character varying NOT NULL DEFAULT 'true'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "valid"`, undefined);
    }

}
