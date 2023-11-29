const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class  $npmConfigName1700750616471 {
    name = ' $npmConfigName1700750616471'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstname" varchar(255) NOT NULL, "lastname" varchar(255) NOT NULL, "username" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "password" varchar(255) NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar NOT NULL, "tags" varchar)`);
        await queryRunner.query(`CREATE TABLE "likes" ("userId" varchar NOT NULL, "photoId" varchar NOT NULL, "username" varchar(255) NOT NULL, PRIMARY KEY ("userId", "photoId"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" varchar PRIMARY KEY NOT NULL, "tagName" varchar(255) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "photo_tag" ("tagId" varchar NOT NULL, "photoId" varchar NOT NULL, "tagName" varchar(255) NOT NULL, PRIMARY KEY ("tagId", "photoId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar NOT NULL, "tags" varchar, CONSTRAINT "FK_4494006ff358f754d07df5ccc87" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_photo"("id", "title", "description", "created_at", "url", "userId", "tags") SELECT "id", "title", "description", "created_at", "url", "userId", "tags" FROM "photo"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo" RENAME TO "photo"`);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("userId" varchar NOT NULL, "photoId" varchar NOT NULL, "username" varchar(255) NOT NULL, CONSTRAINT "FK_e24989f445c2652f8ebc326667f" FOREIGN KEY ("photoId") REFERENCES "photo" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "photoId"))`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("userId", "photoId", "username") SELECT "userId", "photoId", "username" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE TABLE "temporary_photo_tag" ("tagId" varchar NOT NULL, "photoId" varchar NOT NULL, "tagName" varchar(255) NOT NULL, CONSTRAINT "FK_9789a85b01626221971259099e4" FOREIGN KEY ("photoId") REFERENCES "photo" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_69db8e44bd65798e8358f84c107" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("tagId", "photoId"))`);
        await queryRunner.query(`INSERT INTO "temporary_photo_tag"("tagId", "photoId", "tagName") SELECT "tagId", "photoId", "tagName" FROM "photo_tag"`);
        await queryRunner.query(`DROP TABLE "photo_tag"`);
        await queryRunner.query(`ALTER TABLE "temporary_photo_tag" RENAME TO "photo_tag"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "photo_tag" RENAME TO "temporary_photo_tag"`);
        await queryRunner.query(`CREATE TABLE "photo_tag" ("tagId" varchar NOT NULL, "photoId" varchar NOT NULL, "tagName" varchar(255) NOT NULL, PRIMARY KEY ("tagId", "photoId"))`);
        await queryRunner.query(`INSERT INTO "photo_tag"("tagId", "photoId", "tagName") SELECT "tagId", "photoId", "tagName" FROM "temporary_photo_tag"`);
        await queryRunner.query(`DROP TABLE "temporary_photo_tag"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("userId" varchar NOT NULL, "photoId" varchar NOT NULL, "username" varchar(255) NOT NULL, PRIMARY KEY ("userId", "photoId"))`);
        await queryRunner.query(`INSERT INTO "likes"("userId", "photoId", "username") SELECT "userId", "photoId", "username" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`ALTER TABLE "photo" RENAME TO "temporary_photo"`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "description" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "url" varchar(255) NOT NULL, "userId" varchar NOT NULL, "tags" varchar)`);
        await queryRunner.query(`INSERT INTO "photo"("id", "title", "description", "created_at", "url", "userId", "tags") SELECT "id", "title", "description", "created_at", "url", "userId", "tags" FROM "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "temporary_photo"`);
        await queryRunner.query(`DROP TABLE "photo_tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
