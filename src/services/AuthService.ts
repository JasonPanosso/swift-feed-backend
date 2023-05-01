import { DataFeedConfigurationModel } from '../models/DataFeedConfigurationSchema';

export const authenticateFtpUser = async (
  username?: string,
  password?: string
): Promise<boolean> => {
  if (!username || !password) return false;
  try {
    const dataFeedConfiguration = await DataFeedConfigurationModel.findOne({
      ftpLogin: { username, password },
    });

    if (dataFeedConfiguration) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error during FTP authentication: ', error);
    return false;
  }
};
