import { hash } from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.error('Failed to hash password:', error);
    throw new Error('Failed to hash password');
  }
};
