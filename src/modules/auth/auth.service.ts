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
interface IPayloadLogin {
  email: string;
  dob: Date;
  fullName: string;
  gender: string;
  avatar: string;
  role: {
    name: string;
    code: string;
  };
}
interface IPayloadJWTLogin {
  sub: number;
  roleCode: string;
  email: string;
}
interface IPayloadResstTokenLogin {
  user: object;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private resetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
  ) {}
  async login(body: LoginDto): Promise<{
    accessToken: string;
    resetToken: string;
    payload: any;
  }> {
    const pass: string = body.password?.trim();
    const email: string = body.email?.trim();
    const keyAccess = process.env.JWT_SECRET_KEY;
    const keyReset = process.env.JWT_RESET_KEY;
    const timeExpire = '30m';
    const timeExpireReset = '7d';
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
      throw new UnauthorizedException('User does not exist');
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
      expiresIn: timeExpire,
    });
    const resetToken = await this.jwtService.signAsync(payloadJWT, {
      secret: keyReset,
      expiresIn: timeExpireReset,
    });
    //step: save reset Token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const payloadResstToken: IPayloadResstTokenLogin = {
      user: user,
      token: resetToken,
      expiresAt: expiresAt,
      isUsed: false,
    };
    const resetTokenEntity =
      this.resetTokenRepository.create(payloadResstToken);
    await this.resetTokenRepository.save(resetTokenEntity);
    //step: output data
    const data = { accessToken, resetToken, payload };
    return data;
  }
}
