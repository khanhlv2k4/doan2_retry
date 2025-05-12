import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    room_id: number;

    @Column({ unique: true })
    room_code: string;

    @Column()
    building: string;

    @Column({ nullable: true })
    capacity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
