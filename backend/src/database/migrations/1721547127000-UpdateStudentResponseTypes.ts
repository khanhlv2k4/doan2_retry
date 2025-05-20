import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentResponseTypes1721547127000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // No operation needed as this is a type-only change
        // The actual column removal was done in the previous migration
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This is a type-only change, no reversal needed
    }
}
