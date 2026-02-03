import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(User);

    const password = await bcrypt.hash('123456', 10);

    await repo.insert([
      {
        email: 'admin1@teso.com',
        password,
        fullName: 'Admin One',
        gender: 'male',
        role: {
          id: 1,
        },
      },
      {
        email: 'admin2@teso.com',
        password,
        fullName: 'Admin Two',
        gender: 'female',
        role: {
          id: 2,
        },
      },
      {
        email: 'user1@teso.com',
        password,
        fullName: 'User One',
        gender: 'male',
        role: {
          id: 3,
        },
      },
      {
        email: 'user2@teso.com',
        password,
        fullName: 'User Two',
        gender: 'female',
        role: {
          id: 3,
        },
      },
      {
        email: 'user3@teso.com',
        password,
        fullName: 'User Three',
        gender: 'male',
        role: {
          id: 3,
        },
      },
    ]);
  }
}
