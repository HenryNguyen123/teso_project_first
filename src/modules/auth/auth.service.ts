import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { comparePassword } from 'src/shared/utils/hashPassword.util';
import { emailRegex } from 'src/shared/utils/regex.util';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from 'src/database/entities/password-reset-token.entity';
import { IPayloadJWTLogin, IPayloadLogin, IPayloadResetTokenLogin, IResponseLogin } from 'src/common/interfaces/login.interface';
import { RoleCode } from 'src/common/enums/role-code.enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private resetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
  ) { }
  async loginService(body: LoginDto, roleCode: string): Promise<IResponseLogin> {
    const pass: string = body.password?.trim();
    const email: string = body.email?.trim();
    const keyAccess = process.env.JWT_SECRET_KEY;
    const keyReset = process.env.JWT_RESET_KEY;
    const timeExpire = process.env.TIME_EPIRE_TOKEN_ACCESS_LOGIN;
    const timeExpireReset = process.env.TIME_EPIRE_TOKEN_REFRESH_PASSWORD;
    //step: validate input
    if (!pass || !email) {
      throw new BadRequestException('Email or password is required');
    }
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (!keyAccess) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    //step: check user exist
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: {
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('account does not exist');
    }
    //step: check role
    if (user.role.code !== RoleCode.USER) {
      throw new UnauthorizedException('account does not have permission to login');
    }
    //step: check password
    const isValid = await comparePassword(pass, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    //step: payload response
    const payload: IPayloadLogin = {
      email: user.email,
      dob: user.dob,
      fullName: user.fullName,
      gender: user.gender,
      avatar: user.avatar,
      role: {
        name: user.role.name,
        code: user.role.code,
      },
    };
    const payloadJWT: IPayloadJWTLogin = {
      sub: user.id,
      roleCode: user.role.code,
      email: user.email,
    };
    // step: sign token
    const accessToken = await this.jwtService.signAsync(payloadJWT, {
      secret: keyAccess,
      expiresIn: Number(process.env.TIME_EPIRE_TOKEN_ACCESS_LOGIN),
    });
    const refreshToken = await this.jwtService.signAsync(payloadJWT, {
      secret: keyReset,
      expiresIn: Number(process.env.TIME_EPIRE_TOKEN_REFRESH_PASSWORD),
    });
    //step: save reset Token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const payloadResstToken: IPayloadResetTokenLogin = {
      user: user,
      token: refreshToken,
      expiresAt: expiresAt,
      isUsed: false,
    };
    const resetTokenEntity =
      this.resetTokenRepository.create(payloadResstToken);
    await this.resetTokenRepository.save(resetTokenEntity);
    //step: output data
    const data = { accessToken, refreshToken, payload };
    return data;
  }
  // step: login
  async login(body: LoginDto, roleCode: string): Promise<IResponseLogin> {
    return this.loginService(body, roleCode);
  }
}
