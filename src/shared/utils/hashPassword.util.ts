import bcrypt from 'bcrypt';

export const hassPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password.trim(), 10);
};

export const comparePassword = async (
  input: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(input, hashedPassword);
};
