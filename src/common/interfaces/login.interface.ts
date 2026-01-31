export interface IPayloadLogin {
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