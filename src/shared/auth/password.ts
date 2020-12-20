import bcrypt, { genSaltSync } from 'bcrypt';

export const hashPassword = (password: string): string => {
  const salt = genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const verifyPassword = (
  password: string,
  hashedPassword: string,
): boolean => bcrypt.compareSync(password, hashedPassword);
