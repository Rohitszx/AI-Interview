"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRoleToUser1748087484757 = void 0;
class AddRoleToUser1748087484757 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT 'user'`);
        await queryRunner.query(`UPDATE "user" SET "role" = 'user' WHERE "role" IS NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`);
    }
}
exports.AddRoleToUser1748087484757 = AddRoleToUser1748087484757;
//# sourceMappingURL=1748087484757-add-role-to-user.js.map