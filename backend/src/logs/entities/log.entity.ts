import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn()
    log_id: number;

    @Column({ nullable: true })
    user_id: number;

    @Column()
    action: string;

    @Column()
    entity_type: string;

    @Column()
    entity_id: number;

    @Column({ type: 'jsonb', nullable: true })
    details: any;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true, type: 'text' })
    user_agent: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.logs)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
