import { config } from '../config/config';
import {
  DataFeedConfigurationModel,
  DataFeedConfigurationDocument,
} from '../models/DataFeedConfiguration';
import {
  FormattedDataFeedDocument,
  FormattedDataFeedModel,
} from '../models/FormattedDataFeed';
import mongoose from 'mongoose';

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

export const createDataFeedConfigurationOnDb = async (
  feedId: string,
  userId: mongoose.Schema.Types.ObjectId
): Promise<DataFeedConfigurationDocument> => {
  try {
    const doc = await DataFeedConfigurationModel.create({
      feedId: feedId,
      userId: userId,
    });
    if (!doc) {
      throw new Error(
        `DataFeedConfiguration document with id ${feedId} not found`
      );
    }
    console.log(
      `New DataFeedConfiguration for userId ${userId} created with feedId: ${feedId}`
    );
    return doc;
  } catch (error) {
    console.error('Error creating DataFeedConfiguration on database:', error);
    throw error;
  }
};

export const updateDataFeedConfigurationOnDb = async (
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

export const getFormattedDataFeedFromDb = async (
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

export const setupDb = async (): Promise<void> => {
  const uri = config.mongoUri || 'mongodb://localhost:27017/swift-feed';
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
      throw new Error(`Could not connect to database, error: ${error.message}`);
    });
};
