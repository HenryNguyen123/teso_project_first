import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTableDatabase1769766660427 implements MigrationInterface {
  name = 'InitTableDatabase1769766660427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // roles
    await queryRunner.query(`
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // permissions
    await queryRunner.query(`
      CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // role_permissions
    await queryRunner.query(`
      CREATE TABLE role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (role_id, permission_id),
        CONSTRAINT fk_rp_role
          FOREIGN KEY (role_id)
          REFERENCES roles(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_rp_permission
          FOREIGN KEY (permission_id)
          REFERENCES permissions(id)
          ON DELETE CASCADE
      )
    `);

    // users
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar VARCHAR(255),
        dob DATE,
        gender VARCHAR(10),
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_users_roles
          FOREIGN KEY (role_id)
          REFERENCES roles(id)
          ON DELETE RESTRICT
          ON UPDATE CASCADE
      )
    `);

    // password_reset_tokens
    await queryRunner.query(`
      CREATE TABLE password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_password_reset_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    // system_gifts
    await queryRunner.query(`
      CREATE TABLE system_gifts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        quantity INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // user_gifts
    await queryRunner.query(`
      CREATE TABLE user_gifts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        gift_id INT NOT NULL,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user_gifts_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_user_gifts_gift
          FOREIGN KEY (gift_id)
          REFERENCES system_gifts(id)
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS password_reset_tokens`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_user_gift_unique`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_gifts`);
    await queryRunner.query(`DROP TABLE IF EXISTS system_gifts`);
  }
}
