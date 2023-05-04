import { DataFeedConfigurationModel } from '../models/DataFeedConfigurationSchema';

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
