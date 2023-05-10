import { Request, Response } from 'express';
import { RequestWithUser } from '../shared/types';
import {
  DataFeedConfigurationModel,
  DataFeedConfigurationDocument,
} from '../models/DataFeedConfiguration';
import {
  getDataFeedConfigurationForUser,
  getDataFeedConfigurationByFeedId,
  createDataFeedConfigurationForUser,
  updateDataFeedConfiguration,
} from '../services/DatabaseService';

export const getAllDataFeedConfigurationsForUser = async (
  req: RequestWithUser,
  res: Response
) => {
  console.log('getAllDataFeedConfigurations');
  if (!req.user) {
    res.status(500).send('Error getting data feed configurations for user');
    return;
  }
  try {
    const userId = req.user.id;
    const dataFeedConfigs = await getDataFeedConfigurationForUser(userId);
    const formattedDataFeedConfigs = dataFeedConfigs.map((config) => {
      return {
        _id: config._id,
        feedId: config.feedId,
        storeName: config.storeName,
      };
    });
    res.status(200).json(formattedDataFeedConfigs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data feed configurations');
  }
};

export const getDataFeedConfiguration = async (req: Request, res: Response) => {
  try {
    const dataFeedConfig = await getDataFeedConfigurationByFeedId(
      req.params.feedId
    );
    if (dataFeedConfig) {
      res.status(200).json(dataFeedConfig);
    } else {
      res.status(404).send('Data feed configuration not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data feed configuration');
  }
};

export const createDataFeedConfiguration = async (
  req: RequestWithUser,
  res: Response
) => {
  if (!req.user) {
    res.status(500).send('Error creating data feed configuration');
    return;
  }
  const doc = await createDataFeedConfigurationForUser(req.user.id);
  if (doc) {
    res.status(201).json(doc);
  } else {
    res.status(500).send('Error creating data feed configuration');
  }
};

export const putDataFeedConfiguration = async (req: Request, res: Response) => {
  try {
    const feedId = req.params.feedId;
    const { mappingsData, globalRules, storeName, csvHeaders, regexData } =
      req.body;
    const feed = {
      feedId,
      mappingsData,
      globalRules,
      storeName,
      csvHeaders,
      regexData,
    };
    console.log('Updating Data feed configuration:', feed)
    const updatedDataFeedConfig = await updateDataFeedConfiguration(
      feed as DataFeedConfigurationDocument
    );
    if (updatedDataFeedConfig) {
      res.status(200).json(updatedDataFeedConfig);
    } else {
      res.status(404).send('Data feed configuration not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating data feed configuration');
  }
};

export const deleteDataFeedConfiguration = async (
  req: Request,
  res: Response
) => {
  try {
    const deletedDataFeedConfig =
      await DataFeedConfigurationModel.findByIdAndDelete(req.params.feedId);

    if (deletedDataFeedConfig) {
      res.status(200).json(deletedDataFeedConfig);
    } else {
      res
        .status(404)
        .send(`Data feed configuration not found for id ${req.params.feedId}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting data feed configuration');
  }
};
