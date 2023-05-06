import { Request, Response } from 'express';
import {
  DataFeedConfigurationDocument,
  DataFeedConfigurationModel,
} from '../models/DataFeedConfiguration';

export const getAllDataFeedConfigurations = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.userId;

  try {
    const dataFeedConfigs = await DataFeedConfigurationModel.find({ userId });
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
  const id = req.params.id;

  try {
    const dataFeedConfig = await DataFeedConfigurationModel.findById(id);
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
  req: Request,
  res: Response
) => {
  const { userId } = req.body;

  const newDataFeedConfig: DataFeedConfigurationDocument =
    new DataFeedConfigurationModel({
      userId,
    });

  try {
    const savedDataFeedConfig = await newDataFeedConfig.save();
    res.status(201).json(savedDataFeedConfig);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating data feed configuration');
  }
};

export const updateDataFeedConfiguration = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const { mappingsData, globalRules, storeName, csvHeaders } = req.body;

  try {
    const updatedDataFeedConfig =
      await DataFeedConfigurationModel.findByIdAndUpdate(
        id,
        { mappingsData, globalRules, storeName, csvHeaders },
        { new: true }
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
  const id = req.params.id;

  try {
    const deletedDataFeedConfig =
      await DataFeedConfigurationModel.findByIdAndDelete(id);

    if (deletedDataFeedConfig) {
      res.status(200).json(deletedDataFeedConfig);
    } else {
      res.status(404).send('Data feed configuration not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting data feed configuration');
  }
};
