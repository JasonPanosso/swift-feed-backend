import {
  DataFeedConfigurationModel,
  DataFeedConfigurationDocument,
} from '../models/DataFeedConfigurationSchema';

export async function fetchDataFeedConfigurationFromDb(
  feedId: string
): Promise<DataFeedConfigurationDocument> {
  try {
    const doc = await DataFeedConfigurationModel.findOne({ feedId: feedId });
    if (!doc) {
      throw new Error(`Document with id ${feedId} not found`);
    }
    return doc;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    throw error;
  }
}
