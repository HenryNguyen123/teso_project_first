import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as hashUtil from 'src/shared/utils/hashPassword.util';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: jest.Mocked<Repository<User>>;
  let roleRepo: jest.Mocked<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    roleRepo = module.get(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  //step: create user
  describe('create user', () => {
    it('should create user successfully', async () => {
      // user chưa tồn tại
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      // role USER tồn tại
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        id: 1,
        code: 'USER',
      } as Role);

      // mock hash password
      jest.spyOn(hashUtil, 'hashPassword').mockResolvedValue('hashed_password');

      // mock create & save
      userRepo.create.mockReturnValue({
        id: 1,
        email: 'test@gmail.com',
      } as User);

      userRepo.save.mockResolvedValue({
        id: 1,
        email: 'test@gmail.com',
      } as User);

      const result = await service.create(
        {
          email: 'test@gmail.com',
          password: '123456',
          fullName: 'Test User',
        },
        null,
      );

      expect(result.EC).toBe(0);
      expect(result.EM).toBe('Create user successfully');
      expect(result.DT).toBeDefined();
    });

    it('should fail when email already exists', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue({
        id: 99,
        email: 'test@gmail.com',
      } as User);

      const result = await service.create(
        {
          email: 'test@gmail.com',
          password: '123456',
          fullName: 'Test User',
        },
        null,
      );

      expect(result.EC).not.toBe(0);
      expect(result.EM).toBeDefined();
    });

    it('should fail when role not found', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      const result = await service.create(
        {
          email: 'test@gmail.com',
          password: '123456',
          fullName: 'Test User',
        },
        null,
      );

      expect(result.EC).not.toBe(0);
      expect(result.EM).toBeDefined();
    });
  });
  //step: get me
  describe('get me', () => {
    it('should get me successfully', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@gmail.com',
        },
      };

      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        fullName: 'Test User',
        role: {
          id: 1,
          code: 'USER',
        },
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.me(req);

      expect(result.EC).toBe(0);
      expect(result.EM).toBe('Get user successfully');
      expect(result.DT).toBeDefined();
    });
    it('should fail when user not found', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@gmail.com',
        },
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      const result = await service.me(req);

      expect(result.EC).not.toBe(0);
      expect(result.EM).toBeDefined();
    });
  });
  //step: update me
  describe('update me', () => {
    it('should update me successfully', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@gmail.com',
        },
      };

      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        fullName: 'Test User',
        role: {
          id: 1,
          code: 'USER',
        },
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.updateMe(
        req,
        {
          fullName: 'Test User Updated',
        },
        null,
      );

      expect(result.EC).toBe(0);
      expect(result.EM).toBe('Update user successfully');
      expect(result.DT).toBeDefined();
    });
    it('should fail when user not found', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@gmail.com',
        },
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      const result = await service.updateMe(
        req,
        {
          fullName: 'Test User Updated',
        },
        null,
      );

      expect(result.EC).not.toBe(0);
      expect(result.EM).toBeDefined();
    });
  });
});
