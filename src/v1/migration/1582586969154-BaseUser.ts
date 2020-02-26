import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseUser1582586969154 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`",
        );
        await queryRunner.query("DROP TABLE `users`");
    }
}
