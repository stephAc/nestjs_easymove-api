import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1585784042658 implements MigrationInterface {
    name = 'Init1585784042658'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('20', '10')`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT '10', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `, undefined);
        await queryRunner.query(`CREATE TABLE "history" ("id" SERIAL NOT NULL, "price" character varying NOT NULL, "departure_station" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "userId" uuid NOT NULL, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9"`, undefined);
        await queryRunner.query(`DROP TABLE "history"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`DROP TYPE "users_role_enum"`, undefined);
    }

}
