export interface IPayloadLogin {
  email: string;
  dob: Date;
  fullName: string;
  gender: string;
  avatar: string;
  name: string;
  code: string;
  // role: {
  // };
}
export interface IPayloadJWTLogin {
  sub: number;
  roleCode: string;
  email: string;
}
export interface IPayloadResetTokenLogin {
  user: object;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}
export interface IResponseLogin {
  accessToken: string;
  refreshToken: string;
  payload: any;
}
