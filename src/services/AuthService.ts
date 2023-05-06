import { DataFeedConfigurationModel } from '../models/DataFeedConfiguration';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

export const authenticateFtpUser = async (
  username?: string
): Promise<boolean> => {
  if (!username) return false;
  try {
    const dataFeedConfiguration = await DataFeedConfigurationModel.findOne({
      feedId: username,
    });

    if (dataFeedConfiguration) {
      return true;
    }
    console.log(`FTP auth failed: feed ID "${username}" not found in database`);
    return false;
  } catch (error) {
    console.error('Error during FTP authentication: ', error);
    return false;
  }
};

export const userRegister = async (
  email: string,
  password: string
): Promise<string> => {
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new UserModel({ email, password });

  await user.save();

  const payload = { userId: user.id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

  return token;
};

export const userLogin = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  const payload = { userId: user.id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

  return token;
};
