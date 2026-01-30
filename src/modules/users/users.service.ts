import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddUserDto } from 'src/modules/users/dtos/createUser.dto';
import { User } from 'src/database/entities/user.entity';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { Repository } from 'typeorm';
import { hassPassword } from 'src/shared/utils/hashPassword.util';
import { Role } from 'src/database/entities/role.entity';
import { emailRegex } from 'src/shared/utils/regex.util';

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const avatar = file ? `/img/avatar/${file.filename}` : undefined;
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
        // password: hash,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : undefined,
        gender: body.gender ?? undefined,
        avatar,
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
}
