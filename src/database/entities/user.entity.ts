import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { OneToMany } from 'typeorm';
import { PasswordResetToken } from './password-reset-token.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'dob', nullable: true })
  dob: Date;

  @Column({ name: 'gender', nullable: true })
  gender: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  resetTokens: PasswordResetToken[];

  @OneToMany(() => UserGift, (gift) => gift.user)
  userGifts: UserGift[];
}
