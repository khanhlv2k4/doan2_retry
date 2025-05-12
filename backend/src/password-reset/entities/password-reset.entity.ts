import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('password_reset')
export class PasswordReset {
    @PrimaryGeneratedColumn()
    reset_id: number;

    @Column()
    user_id: number;

    @Column({ unique: true })
    token: string;

    @Column()
    expires_at: Date;

    @Column({ default: false })
    is_used: boolean;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.passwordResets)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
