import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SystemGift } from './system-gift.entity';

@Entity('user_gifts')
export class UserGift {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SystemGift, (gift) => gift.userGifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gift_id' })
  gift: SystemGift;

  @CreateDateColumn({ name: 'received_at' })
  receivedAt: Date;
}
