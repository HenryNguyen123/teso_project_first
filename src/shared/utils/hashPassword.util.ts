import bcrypt from 'bcrypt';

export const hassPassword = async (password: string): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await bcrypt.hash(password.trim(), 10);
};

export const comparePassword = async (
  input: string,
  hashedPassword: string,
): Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await bcrypt.compare(input, hashedPassword);
};
