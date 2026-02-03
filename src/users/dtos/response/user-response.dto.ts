import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  gender: string;

  @Expose()
  avatar: string;

  @Expose()
  role: {
    name: string;
    code: string;
  };
}
