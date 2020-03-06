import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseUser1582760379065 implements MigrationInterface {
    name = 'BaseUser1582760379065'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `email` varchar(100) NOT NULL, `username` varchar(100) NOT NULL, `password` varchar(100) NOT NULL, `role` enum ('20', '10') NOT NULL DEFAULT '10', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`", undefined);
        await queryRunner.query("DROP TABLE `users`", undefined);
    }

}
