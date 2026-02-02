import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { User } from 'src/database/entities/user.entity';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { Repository } from 'typeorm';
import {
  comparePassword,
  hashPassword,
} from 'src/shared/utils/hashPassword.util';
import { Role } from 'src/database/entities/role.entity';
import { emailRegex } from 'src/shared/utils/regex.util';
import { Request } from 'express';
import { IPayloadLogin } from 'src/common/interfaces/login.interface';
import { UpdateUserDto } from 'src/modules/users/dtos/updateUserDto.dto';
import { avatarPath } from 'src/shared/utils/uploadAvatar.util';
import { deleteFile } from 'src/shared/utils/deleteFile.util';
import { ChangePasswordDto } from 'src/modules/users/dtos/changePasswordDto.dto';
type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}
  //step 1: create user
  async create(body: CreateAddUserDto, file: Express.Multer.File) {
    try {
      const avatar = file ? avatarPath(file) : undefined;
      const password = body.password.trim();
      const email = body.email.trim();
      const userCode = 'USER';
      //step: validate
      if (!email || !password || !body.fullName)
        return responseError('Missing required fields', 1000);
      if (password.length < 6)
        return responseError('Password must be at least 6 characters', 1001);
      if (!emailRegex.test(email))
        return responseError('Invalid email format', 1002);
      //step: check email exist
      const checkEmail = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (checkEmail) return responseError('Email already exists', 1003);
      //step: hash password
      const hash = await hashPassword(password);
      //step: check role
      const role = await this.RoleRepository.findOne({
        where: {
          code: userCode,
        },
      });
      if (!role) return responseError('Role not found', 1004);
      //step create user
      const payload = {
        email: email,
        // password: hash,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : undefined,
        gender: body.gender ?? undefined,
        avatar: avatar ? `/img/avatar/${avatar}` : undefined,
        role: role,
        created_at: new Date(),
      };
      const user = this.usersRepository.create({ ...payload, password: hash });
      const checkCreateUser = await this.usersRepository.save(user);
      if (checkCreateUser) {
        return responseSuccess('Create user successfully', 0, payload);
      }
      return responseError('create user fail', 1005);
    } catch (error) {
      console.log('create user error:', error);
      return responseError('get accout user fail', 1006);
    }
  }
  // step 5: get me
  async me(req: Request) {
    try {
      const getUser = req.user as IPayloadLogin;
      if (!getUser) return responseError('User not found', 1007);
      const email = getUser.email;
      if (!emailRegex.test(email))
        return responseError('Invalid email format', 1002);
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
      });
      if (!user) return responseError('User not found', 1007);
      return responseSuccess('Get user successfully', 0, user);
    } catch (error) {
      console.log('get user error:', error);
      return responseError('get user fail', 1008);
    }
  }
  //step 6: update me
  async updateMe(req: Request, body: UpdateUserDto, file: Express.Multer.File) {
    try {
      const getUser = req.user as IPayloadLogin;
      if (!getUser) return responseError('User not found', 1007);
      const email = getUser.email;
      if (!emailRegex.test(email))
        return responseError('Invalid email format', 1002);
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
      });
      if (!user) return responseError('User not found', 1007);
      // step:save update user
      if (body.fullName !== undefined) {
        const name = body.fullName.trim();
        if (name.length > 0) {
          user.fullName = name;
        }
      }
      if (body.dob !== undefined && body.dob !== null) {
        const dobStr = String(body.dob);
        const dob = new Date(`${dobStr}T00:00:00`);
        if (isNaN(dob.getTime())) {
          return responseError('Invalid dob format', 400);
        }
        user.dob = dob;
      }
      if (body.gender !== undefined) {
        user.gender = body.gender as GenderType;
      }
      //step: update avatar
      if (file) {
        if (user.avatar) {
          deleteFile(user.avatar);
        }
        user.avatar = avatarPath(file);
      }
      await this.usersRepository.save(user);
      const updatedUser = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
      });
      return responseSuccess('Update user successfully', 0, updatedUser);
    } catch (error) {
      console.log('update user error:', error);
      return responseError('update user fail', 1008);
    }
  }
  //step 7: change password
  async changePassword(req: Request, body: ChangePasswordDto) {
    try {
      //step: validate
      const getUser = req.user as IPayloadLogin;
      if (!getUser) return responseError('User not found', 1007);
      const password = body.newPassword.trim();
      if (password.length < 6)
        return responseError('Password must be at least 6 characters', 1001);
      const email = getUser.email;
      if (!emailRegex.test(email))
        return responseError('Invalid email format', 1002);
      if (!body.oldPassword || !body.newPassword)
        return responseError('Password is required', 1003);
      if (body.oldPassword === body.newPassword)
        return responseError(
          'New password must be different from old password',
          1011,
        );
      //step: check user
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.email = :email', { email: email })
        .getOne();
      if (!user) return responseError('User not found', 1007);
      //step: check old password
      const checkPassword = await comparePassword(
        body.oldPassword,
        user.password,
      );
      if (!checkPassword)
        return responseError('Old password is incorrect', 1010);
      //step: hash new password
      const hash = await hashPassword(password);
      user.password = hash;
      await this.usersRepository.save(user);
      const updateUser = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
      });
      return responseSuccess('Change password successfully', 0, updateUser);
    } catch (error) {
      console.log('change password error:', error);
      return responseError('change password fail', 1009);
    }
  }
}
