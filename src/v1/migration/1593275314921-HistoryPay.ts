import {MigrationInterface, QueryRunner} from "typeorm";

export class HistoryPay1593275314921 implements MigrationInterface {
    name = 'HistoryPay1593275314921'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "historyPay_action_enum" AS ENUM('ticket', 'pass', 'refund', 'deposit', 'withdraw')`, undefined);
        await queryRunner.query(`CREATE TABLE "historyPay" ("id" SERIAL NOT NULL, "action" "historyPay_action_enum" NOT NULL, "price" character varying NOT NULL, "date_purchase" TIMESTAMP NOT NULL DEFAULT Now(), "userId" uuid NOT NULL, CONSTRAINT "PK_20db3accc04ad4cafb9172dd4d0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "historyPay" ADD CONSTRAINT "FK_74facfddf94323763a7e13ca3c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "historyPay" DROP CONSTRAINT "FK_74facfddf94323763a7e13ca3c6"`, undefined);
        await queryRunner.query(`DROP TABLE "historyPay"`, undefined);
        await queryRunner.query(`DROP TYPE "historyPay_action_enum"`, undefined);
    }

}
