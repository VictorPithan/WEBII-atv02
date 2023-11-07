const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class  $npmConfigName1699036746608 {
    name = ' $npmConfigName1699036746608'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstname" varchar(255) NOT NULL, "lastname" varchar(255) NOT NULL, "username" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "password" varchar(255) NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
