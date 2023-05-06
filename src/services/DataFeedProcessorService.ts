import { Readable } from 'stream';
import { parseTextData } from '../utils/parseTextDataUtil';
import {
  fetchDataFeedConfigurationFromDb,
  saveFormattedDataFeedToDb,
} from './DatabaseService';
import {
  FormattedDataFeedDocument,
  FormattedDataFeedModel,
} from '../models/FormattedDataFeed';
import { applyMappingsToCsvData } from './MappingOperationProcessingService';
import { evaluateConditions } from '../utils/conditionalOperationsUtil';
import type {
  MappingData,
  ParsedData,
  MappingOperationConditions,
} from '../shared/types';

interface ProcessResult {
  success: boolean;
  message: string;
  error?: Error;
}

// Main entry point for business logic
const processDataFeed = async (
  stream: Readable,
  feedId: string
): Promise<ProcessResult> => {
  try {
    const doc = await fetchDataFeedConfigurationFromDb(feedId);
    const parsedData = await parseTextData(stream);
    const filteredData = filterDataByGlobalRules(
      parsedData,
      doc.globalRules as MappingOperationConditions[]
    );
    const formattedData = applyMappingsToCsvData(
      filteredData,
      doc.mappingsData as MappingData[]
    );
    const savedDocument = await saveFormattedData(feedId, formattedData);
    console.log(savedDocument);
    return { success: true, message: 'Data processing completed successfully' };
  } catch (error) {
    console.error(`Error during data processing for feedId ${feedId}:`, error);
    if (error instanceof Error) {
      return { success: false, message: 'Data processing failed', error };
    } else {
      return {
        success: false,
        message: 'Data processing failed due to an unknown error',
      };
    }
  }
};

const saveFormattedData = async (
  feedId: string,
  data: Array<Record<string, string>>
): Promise<FormattedDataFeedDocument> => {
  const formattedDataFeed = new FormattedDataFeedModel({
    feedId: feedId,
    data: data,
  });
  try {
    const savedDocument = await saveFormattedDataFeedToDb(formattedDataFeed);
    return savedDocument;
  } catch (error) {
    console.error(`Error saving formatted data for feed: ${feedId}`, error);
    throw error;
  }
};

const filterDataByGlobalRules = (
  data: ParsedData,
  globalRules: MappingOperationConditions[]
): ParsedData => {
  return data.filter((dataRow) => evaluateConditions(globalRules, dataRow));
};

export { processDataFeed };
