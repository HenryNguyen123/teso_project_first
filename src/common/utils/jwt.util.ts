import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IJwtPayload } from 'src/auth/interfaces/jwt.interface';
import { User } from 'src/users/entities/user.entity';

interface SignJwtType {
  payload: object;
  secret: string;
  expiresIn: JwtSignOptions['expiresIn'];
}
const jwt = new JwtService();
export const signJWT = async (
  user: User,
  keyAccess: string | undefined,
  data: SignJwtType,
) => {
  try {
    const token = await jwt.signAsync(data.payload, {
      secret: data.secret,
      expiresIn: data.expiresIn ?? 900,
    });
    return token;
  } catch (error: unknown) {
    console.log(error);
    throw new HttpException(
      { message: 'verify password error' },
      HttpStatus.UNAUTHORIZED,
    );
  }
};

export const verifyJWT = async (token: string, key: string) => {
  try {
    const payload = await jwt.verifyAsync<IJwtPayload>(token, {
      secret: key,
    });
    return payload;
  } catch (error: unknown) {
    console.log(error);
    return false;
  }
};
