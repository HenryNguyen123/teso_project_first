import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from 'src/auth/dtos/request/login.dto';
import { comparePassword } from 'src/common/utils/hash-password.util';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from 'src/auth/entities/password-reset-token.entity';
import {
  IPayloadJWTLogin,
  IPayloadLogin,
  IPayloadResetTokenLogin,
  IResponseLogin,
} from 'src/auth/interfaces/login.interface';
import { plainToInstance } from 'class-transformer';
import { LoginResponseDto } from 'src/auth/dtos/response/login-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private resetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async loginService(
    body: LoginDto,
    roleCode: string,
  ): Promise<IResponseLogin> {
    const pass: string = body.password;
    const email: string = body.email;
    const keyAccess = this.configService.get<string>('JWT_SECRET_KEY');
    const keyReset = this.configService.get<string>('JWT_RESET_KEY');
    const timeExpireTokenAccessLogin = Number(
      this.configService.get<string | number>('TIME_EPIRE_TOKEN_ACCESS_LOGIN'),
    );
    const timeExpireTokenRefreshPassword = Number(
      this.configService.get<string | number>(
        'TIME_EPIRE_TOKEN_REFRESH_PASSWORD',
      ),
    );
    //step: validate input
    if (!timeExpireTokenAccessLogin || !timeExpireTokenRefreshPassword) {
      throw new InternalServerErrorException('JWT expiration config missing');
    }
    if (!keyAccess || !keyReset) {
      throw new InternalServerErrorException('JWT config missing');
    }

    //step: check user exist
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('account does not exist');
    }
    //step: check role
    if (user.role.code !== roleCode) {
      throw new ForbiddenException('account does not have permission to login');
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
      expiresIn: timeExpireTokenAccessLogin,
    });
    const refreshToken = await this.jwtService.signAsync(payloadJWT, {
      secret: keyReset,
      expiresIn: timeExpireTokenRefreshPassword,
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
    return plainToInstance(LoginResponseDto, {
      accessToken,
      refreshToken,
      payload,
    });
  }
  // step: login
  async login(body: LoginDto, roleCode: string): Promise<IResponseLogin> {
    return this.loginService(body, roleCode);
  }
}
