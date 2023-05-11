import { config, s3Config } from '../config/config';
import {
  DataFeedConfigurationModel,
  DataFeedConfigurationDocument,
} from '../models/DataFeedConfiguration';
import {
  FormattedDataFeedDocument,
  FormattedDataFeedModel,
} from '../models/FormattedDataFeed';
import { createBackup } from './BackupService';
import { verifyObjectKeysAreDefined } from '../utils/verifyObjectKeysUtil';
import * as cron from 'node-cron';
import mongoose from 'mongoose';

export const getDataFeedConfigurationForUser = async (
  userId: string
): Promise<Array<DataFeedConfigurationDocument>> => {
  try {
    const doc = await DataFeedConfigurationModel.find({ userId });
    if (!doc) {
      throw new Error(`Unable to find any configurations for user ${userId}`);
    }
    return doc;
  } catch (error) {
    console.error('Error fetching DataFeedConfiguration from database:', error);
    throw error;
  }
};

export const getDataFeedConfigurationByFeedId = async (
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

export const createDataFeedConfigurationForUser = async (
  userId: string
): Promise<DataFeedConfigurationDocument> => {
  try {
    const doc = await DataFeedConfigurationModel.create({
      userId: userId,
    });
    if (!doc) {
      throw new Error(
        `Unable to create new DataFeedConfiguration for userId ${userId}`
      );
    }
    console.log(
      `New DataFeedConfiguration for userId ${userId} created with feedId: ${doc.feedId}`
    );
    return doc;
  } catch (error) {
    console.error('Error creating DataFeedConfiguration on database:', error);
    throw error;
  }
};

export const updateDataFeedConfiguration = async (
  feed: DataFeedConfigurationDocument
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

export const deleteDataFeedConfiguration = async (
  feedId: string
): Promise<DataFeedConfigurationDocument> => {
  try {
    const doc = await DataFeedConfigurationModel.findByIdAndDelete({ feedId });
    if (doc) {
      return doc;
    } else {
      throw new Error(
        `Failed to delete document - No DataFeedConfiguration with feedId: ${feedId}`
      );
    }
  } catch (error) {
    console.error('Error deleting DataFeedConfiguration from database:', error);
    throw error;
  }
};

export const getFormattedDataFeed = async (
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

export const saveFormattedDataFeed = async (
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

const setupBackup = async () => {
  const backupOptions = {
    path: config.mongoBackupPath || `${process.cwd()}/backups`,
    s3: config.s3BackupEnabled ? s3Config : undefined,
  };
  if (backupOptions.s3 && !backupOptions.s3.key)
    backupOptions.s3.key = String(Date.now());
  cron.schedule(config.mongoBackupFrequency || '0 0 * * *', () => {
    createBackup(backupOptions);
  });
  await createBackup(backupOptions);
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
  if (config.mongoBackupEnabled) await setupBackup();
};
