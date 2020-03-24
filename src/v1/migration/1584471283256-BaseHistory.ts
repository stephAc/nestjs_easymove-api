import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseHistory1584471283256 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("CREATE TABLE `history` (`id` int NOT NULL AUTO_INCREMENT, `price` varchar(255) NOT NULL, `departure_station` varchar(255) NOT NULL, `created_at` datetime NOT NULL DEFAULT NOW(), `userId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `users` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`)");
        await queryRunner.query("ALTER TABLE `history` ADD CONSTRAINT `FK_7d339708f0fa8446e3c4128dea9` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `history` DROP FOREIGN KEY `FK_7d339708f0fa8446e3c4128dea9`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_97672ac88f789774dd47f7c8be`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `updated_at`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `created_at`");
        await queryRunner.query("ALTER TABLE `users` ADD `updatedAt` datetime(6) NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)'");
        await queryRunner.query("ALTER TABLE `users` ADD `createdAt` datetime(6) NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)'");
        await queryRunner.query("DROP TABLE `history`");
        await queryRunner.query("CREATE INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users` (`email`)");
    }

}
