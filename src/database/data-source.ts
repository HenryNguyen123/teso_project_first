import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { RolePermission } from '../auth/entities/role-permission.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [
    User,
    Role,
    Permission,
    RolePermission,
    PasswordResetToken,
    UserGift,
    SystemGift,
  ],

  migrations: ['dist/src/database/migrations/*.js'],
  synchronize: false,
  logging: false,

  seeds: ['dist/src/database/seeds/*.js'],
  factories: ['dist/src/database/factories/*.js'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
