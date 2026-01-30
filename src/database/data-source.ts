import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/rolePermission.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';
import { SystemGift } from 'src/database/entities/system-gift.entity';

export const AppDataSource = new DataSource({
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

  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: false,
});
