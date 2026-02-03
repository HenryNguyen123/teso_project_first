import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'src/auth/entities/role.entity';

export default class RoleSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Role);

    await repo.insert([
      { name: 'Administrator', code: 'ADMIN' },
      { name: 'User', code: 'USER' },
    ]);
  }
}
