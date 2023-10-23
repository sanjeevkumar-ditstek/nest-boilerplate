import * as bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};

export const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};
