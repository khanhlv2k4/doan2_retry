import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDepartmentNullable1720001234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column exists first
        const hasColumn = await queryRunner.hasColumn('students', 'department');

        if (!hasColumn) {
            // If column doesn't exist, add it as nullable
            await queryRunner.query(`ALTER TABLE students ADD COLUMN department VARCHAR(100) NULL`);
        } else {
            // If column exists, alter it to be nullable
            await queryRunner.query(`ALTER TABLE students ALTER COLUMN department DROP NOT NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Make column NOT NULL again if you want to revert
        await queryRunner.query(`ALTER TABLE students ALTER COLUMN department SET NOT NULL`);
    }
}
