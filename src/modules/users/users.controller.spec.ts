import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/modules/users/users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { UpdateUserDto } from 'src/modules/users/dtos/updateUserDto.dto';
import { ChangePasswordDto } from 'src/modules/users/dtos/changePasswordDto.dto';
describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    me: jest.fn(),
    updateMe: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //step 1: create user
  describe('create', () => {
    it('should create a user', async () => {
      const file = {
        filename: 'avatar.jpg',
      } as Express.Multer.File;

      const body = {
        email: 'test@example.com',
        password: 'test123',
        fullName: 'Test User',
        dob: new Date('2000-01-01'),
        gender: 'male',
        role: {
          id: 1,
          name: 'User',
          code: 'USER',
        },
      };

      mockUsersService.create.mockResolvedValue(body);

      const result = await controller.create(body as CreateAddUserDto, file);

      expect(mockUsersService.create).toHaveBeenCalledWith(body, file);
      expect(result).toEqual(body);
    });
  });

  //step 5: get me
  describe('me', () => {
    it('should return current user info', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
      };

      mockUsersService.me.mockResolvedValue(mockUser);

      const result = await controller.me(req);

      // controller đang gọi service.me(req)
      expect(mockUsersService.me).toHaveBeenCalledWith(req);
      expect(result).toEqual(mockUser);
    });
  });

  //step 6: update me
  describe('updateMe', () => {
    it('should update current user info', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      };

      const body = {
        fullName: 'Updated Name',
      };

      const file = {
        filename: 'new-avatar.jpg',
      } as Express.Multer.File;

      const updatedUser = {
        id: 1,
        fullName: 'Updated Name',
        avatar: 'new-avatar.jpg',
      };

      mockUsersService.updateMe.mockResolvedValue(updatedUser);

      const result = await controller.updateMe(
        req,
        body as UpdateUserDto,
        file,
      );

      // controller đang gọi updateMe(req, body, file)
      expect(mockUsersService.updateMe).toHaveBeenCalledWith(req, body, file);
      expect(result).toEqual(updatedUser);
    });
  });

  //step 7: change password
  describe('changePassword', () => {
    it('should change user password', async () => {
      const req: any = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      };

      const body: ChangePasswordDto = {
        oldPassword: 'old123',
        newPassword: 'new123',
      };

      const response = {
        message: 'Password changed successfully',
      };

      mockUsersService.changePassword.mockResolvedValue(response);

      const result = await controller.changePassword(body, req);

      expect(mockUsersService.changePassword).toHaveBeenCalledWith(body, req);
      expect(result).toEqual(response);
    });
  });
});
