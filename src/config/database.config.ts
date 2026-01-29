import { DataSource } from 'typeorm';
import 'dotenv/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
      });

      try {
        await dataSource.initialize();
        console.log('PostgreSQL connected successfully');

        await dataSource.query('SELECT 1');
        console.log('PostgreSQL query OK');

        return dataSource;
      } catch (error) {
        console.error('PostgreSQL connection failed');
        console.error(error);
        throw error;
      }
    },
  },
];
