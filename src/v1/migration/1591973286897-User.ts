import {MigrationInterface, QueryRunner} from "typeorm";

export class User1591973286897 implements MigrationInterface {
    name = 'User1591973286897'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "image" character varying(100)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image"`, undefined);
    }

}
