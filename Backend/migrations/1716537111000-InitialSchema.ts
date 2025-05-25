import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Initial schema migration
 * Creates the base database structure for the application
 */
export class InitialSchema1716537111000 implements MigrationInterface {
    name = 'InitialSchema1716537111000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Job descriptions table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "jds" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying,
                "path" character varying,
                "text" text,
                "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_jds" PRIMARY KEY ("id")
            )
        `);

        // Resumes table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "resumes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying NOT NULL,
                "path" character varying NOT NULL,
                "text" text,
                "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_resumes" PRIMARY KEY ("id")
            )
        `);

        // Interviews table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "interviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "scheduledAt" TIMESTAMP,
                "completedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "resumeId" uuid,
                "jdId" uuid,
                CONSTRAINT "PK_interviews" PRIMARY KEY ("id")
            )
        `);

        // Foreign keys
        await queryRunner.query(`
            ALTER TABLE "jds" 
            ADD CONSTRAINT "FK_jds_users" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "resumes" 
            ADD CONSTRAINT "FK_resumes_users" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "interviews" 
            ADD CONSTRAINT "FK_interviews_users" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "interviews" 
            ADD CONSTRAINT "FK_interviews_resumes" 
            FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") 
            ON DELETE SET NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "interviews" 
            ADD CONSTRAINT "FK_interviews_jds" 
            FOREIGN KEY ("jdId") REFERENCES "jds"("id") 
            ON DELETE SET NULL
        `);

        // Create uuid extension if it doesn't exist
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_interviews_jds"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_interviews_resumes"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_interviews_users"`);
        await queryRunner.query(`ALTER TABLE "resumes" DROP CONSTRAINT "FK_resumes_users"`);
        await queryRunner.query(`ALTER TABLE "jds" DROP CONSTRAINT "FK_jds_users"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "interviews"`);
        await queryRunner.query(`DROP TABLE "resumes"`);
        await queryRunner.query(`DROP TABLE "jds"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
