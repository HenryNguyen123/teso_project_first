import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { Repository } from 'typeorm';
import { hassPassword } from 'src/shared/utils/hashPassword.util';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}
  //step 1: create user
  async create(body: CreateAddUserDto) {
    try {
      const password = body.password.trim();
      const email = body.email.trim();
      const userCode = 'user';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //step: validate
      if (!email || !password || !body.fulName)
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
      const hash = await hassPassword(password);
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
        password: hash,
        fullName: body.fulName,
        dob: body.dob ? new Date(body.dob) : undefined,
        gender: body.gender ?? undefined,
        // role_id: role.id,
        role: { id: role.id },
        created_at: new Date(),
      };
      const user = this.usersRepository.create(payload);
      await this.usersRepository.save(user);
      return responseSuccess('Create user successfully', 0, true);
    } catch (error) {
      console.log('create user error:', error);
      return responseError('get accout user fail', 1);
    }
  }
}
