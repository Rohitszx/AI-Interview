import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUser1748087484757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add role column to user table with default value 'user'
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT 'user'`);
        
        // Update existing users to have the 'user' role
        await queryRunner.query(`UPDATE "user" SET "role" = 'user' WHERE "role" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the role column from the user table
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`);
    }

}
