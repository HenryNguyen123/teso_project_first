import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';

export default class SystemGiftSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(SystemGift);

    await repo.insert([
      {
        name: 'Gift Card 50K',
        description: 'Gift card trị giá 50.000đ',
        image: 'gift_50k.png',
        quantity: 100,
        isActive: true,
      },
      {
        name: 'Gift Mystery Box',
        description: 'Hộp quà bí ẩn',
        image: 'mystery.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 100K',
        description: 'Gift card trị giá 100.000đ',
        image: 'gift_100k.png',
        quantity: 50,
        isActive: true,
      },
      {
        name: 'Gift Card 200K',
        description: 'Gift card trị giá 200.000đ',
        image: 'gift_200k.png',
        quantity: 25,
        isActive: true,
      },
      {
        name: 'Gift Card 500K',
        description: 'Gift card trị giá 500.000đ',
        image: 'gift_500k.png',
        quantity: 10,
        isActive: true,
      },
      {
        name: 'Gift Card 1M',
        description: 'Gift card trị giá 1.000.000đ',
        image: 'gift_1m.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 2M',
        description: 'Gift card trị giá 2.000.000đ',
        image: 'gift_2m.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 5M',
        description: 'Gift card trị giá 5.000.000đ',
        image: 'gift_5m.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 10M',
        description: 'Gift card trị giá 10.000.000đ',
        image: 'gift_10m.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 20M',
        description: 'Gift card trị giá 20.000.000đ',
        image: 'gift_20m.png',
        quantity: 5,
        isActive: true,
      },
      {
        name: 'Gift Card 50M',
        description: 'Gift card trị giá 50.000.000đ',
        image: 'gift_50m.png',
        quantity: 5,
        isActive: true,
      },
    ]);
  }
}
