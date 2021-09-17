import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenArticlesAndUser1631736106437 implements MigrationInterface {
    name = 'AddRelationsBetweenArticlesAndUser1631736106437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."articles" ADD "authorId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "public"."articles" DROP COLUMN "authorId"`);
    }

}
