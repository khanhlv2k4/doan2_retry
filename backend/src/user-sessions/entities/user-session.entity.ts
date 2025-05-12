import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column()
    user_id: number;

    @Column({ unique: true })
    token: string;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true, type: 'text' })
    user_agent: string;

    @Column()
    expires_at: Date;

    @Column({ default: true })
    is_valid: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.sessions)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
