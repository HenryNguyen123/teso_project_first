export const responseSuccess = (message: string, code: number, data: any) => ({
  EM: message,
  EC: code,
  DT: data as object | object[],
});

export const responseError = (message: string, code: number = -1) => ({
  EM: message,
  EC: code,
  DT: [],
});
