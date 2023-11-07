const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class  $npmConfigName1699127726810 {
    name = ' $npmConfigName1699127726810'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "photo"`);
    }
}
