import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDepartmentFromStudents1721547126000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE students DROP COLUMN IF EXISTS department');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE students ADD COLUMN department VARCHAR(100)');
    }
}
