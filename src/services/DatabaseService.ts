import {
  DataFeedConfigurationModel,
  DataFeedConfigurationDocument,
} from '../models/DataFeedConfigurationSchema';
import {
  FormattedDataFeedDocument,
  FormattedDataFeedModel,
} from '../models/FormattedDataFeedSchema';

export const fetchDataFeedConfigurationFromDb = async (
  feedId: string
): Promise<DataFeedConfigurationDocument> => {
  try {
    const doc = await DataFeedConfigurationModel.findOne({ feedId: feedId });
    if (!doc) {
      throw new Error(`Document with id ${feedId} not found`);
    }
    return doc;
  } catch (error) {
    console.error('Error fetching DataFeedConfiguration from database:', error);
    throw error;
  }
};

export const createDataFeedConfigurationToDb = async (
  feedId: string
): Promise<DataFeedConfigurationDocument> => {
  try {
    const doc = await DataFeedConfigurationModel.create({ feedId: feedId });
    if (!doc) {
      throw new Error(
        `DataFeedConfiguration document with id ${feedId} not found`
      );
    }
    return doc;
  } catch (error) {
    console.error('Error creating DataFeedConfiguration on database:', error);
    throw error;
  }
};

export const updateDataFeedConfigurationToDb = async (
  feed: any
): Promise<DataFeedConfigurationDocument> => {
  try {
    const updatedDoc = await DataFeedConfigurationModel.findOneAndUpdate(
      { feedId: feed.feedId },
      feed,
      { new: true }
    );
    if (updatedDoc) {
      return updatedDoc;
    } else {
      throw new Error(
        `Failed to update document - No DataFeedConfiguration with feedId: ${feed.feedId}`
      );
    }
  } catch (error) {
    console.error('Error saving DataFeedConfiguration to database:', error);
    throw error;
  }
};

export const fetchFormattedDataFeedFromDb = async (
  feedId: string
): Promise<FormattedDataFeedDocument> => {
  try {
    const doc = await FormattedDataFeedModel.findOne({ feedId: feedId });
    if (!doc) {
      throw new Error(`Document with id ${feedId} not found`);
    }
    return doc;
  } catch (error) {
    console.error('Error fetching FormattedDataFeed from database:', error);
    throw error;
  }
};

export const saveFormattedDataFeedToDb = async (
  feed: FormattedDataFeedDocument
): Promise<FormattedDataFeedDocument> => {
  try {
    const existingDoc = await FormattedDataFeedModel.findOne({
      feedId: feed.feedId,
    });

    if (!existingDoc) {
      const savedDoc = await FormattedDataFeedModel.create(feed);
      console.log(`Created new document with id ${savedDoc._id}`);
      return savedDoc;
    } else {
      const updatedDoc = await FormattedDataFeedModel.findOneAndUpdate(
        { feedId: feed.feedId },
        { data: feed.data },
        { new: true }
      );
      if (updatedDoc) {
        console.log(`Updated document with id ${updatedDoc._id}`);
        return updatedDoc;
      } else {
        throw new Error(`Failed to update document with feedId ${feed.feedId}`);
      }
    }
  } catch (error) {
    console.error('Error saving FormattedDataFeed to database:', error);
    throw error;
  }
};
