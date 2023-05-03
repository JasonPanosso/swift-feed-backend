import { Readable } from 'stream';
import { parseCsvData } from './CsvParsingService';
import {
  fetchDataFeedConfigurationFromDb,
  saveFormattedDataFeedToDb,
} from './DatabaseService';
import {
  FormattedDataFeedDocument,
  FormattedDataFeedModel,
} from '../models/FormattedDataFeedSchema';
import { applyMappingsToCsvData } from './MappingOperationProcessingService';
import { evaluateConditions } from '../utils/conditionalOperations';
import type {
  MappingData,
  ParsedCsvData,
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
    const csvData = await parseCsvData(stream);
    const doc = await fetchDataFeedConfigurationFromDb(feedId);
    const filteredCsvData = filterCsvDataByGlobalRules(
      csvData,
      doc.globalRules as MappingOperationConditions[]
    );
    const formattedData = applyMappingsToCsvData(
      filteredCsvData,
      doc.mappingsData as MappingData[]
    );
    const savedDocument = await saveFormattedData(feedId, formattedData);
    console.log(savedDocument);
    return { success: true, message: 'Data processing completed successfully' };
  } catch (error) {
    console.error('Error during data processing:', error);
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

const filterCsvDataByGlobalRules = (
  csvData: ParsedCsvData,
  globalRules: MappingOperationConditions[]
): ParsedCsvData => {
  return csvData.filter((dataRow) => evaluateConditions(globalRules, dataRow));
};

export { processDataFeed };
