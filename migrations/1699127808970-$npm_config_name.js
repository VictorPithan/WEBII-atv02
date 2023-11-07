const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class  $npmConfigName1699127808970 {
    name = ' $npmConfigName1699127808970'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "title", "description", "created_at", "url") SELECT "id", "title", "description", "created_at", "url" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar, CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "title", "description", "created_at", "url", "userId") SELECT "id", "title", "description", "created_at", "url", "userId" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "photo"("id", "title", "description", "created_at", "url", "userId") SELECT "id", "title", "description", "created_at", "url", "userId" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "photo"("id", "title", "description", "created_at", "url") SELECT "id", "title", "description", "created_at", "url" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
    }
}
