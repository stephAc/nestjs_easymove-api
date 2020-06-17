import {MigrationInterface, QueryRunner} from "typeorm";

export class User1592408037951 implements MigrationInterface {
    name = 'User1592408037951'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "wallet" double precision NOT NULL DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wallet"`, undefined);
    }

}
