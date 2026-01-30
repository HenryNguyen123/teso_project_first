import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { comparePassword } from 'src/shared/utils/hashPassword.util';
import { emailRegex } from 'src/shared/utils/regex.util';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async login(body: LoginDto, res: Response, Req: Request) {
    try {
      const pass = body.password;
      const email = body.email;
      if (!pass || !email) return responseError('', 1000);
      if (!emailRegex.test(email)) return responseError('', 1001);
      //step: check user exist
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (!user) return responseError('', 1002);
      //step: check password
      const checkPassword = await comparePassword(pass, user.password);
      if (!checkPassword) return responseError('', 1003);
      return responseSuccess('', 0, user);
    } catch (error) {
      console.log('create user error:', error);
      return responseError('get accout user fail', 1006);
    }
  }
}
