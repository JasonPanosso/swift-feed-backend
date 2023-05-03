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

class FeedProcessingMediator {
  // Main entry point for business logic
  async processData(stream: Readable, feedId: string): Promise<boolean> {
    try {
      const csvData = await parseCsvData(stream);
      const doc = await fetchDataFeedConfigurationFromDb(feedId);
      const filteredCsvData = this.filterCsvDataByGlobalRules(
        csvData,
        doc.globalRules as MappingOperationConditions[]
      );
      const formattedData = applyMappingsToCsvData(
        filteredCsvData,
        doc.mappingsData as MappingData[]
      );
      const savedToDb = await this.saveFormattedData(feedId, formattedData);
      console.log(savedToDb);
    } catch (error) {
      console.error('Error during data processing:', error);
      return false;
    }
    return true;
  }
  async saveFormattedData(
    feedId: string,
    data: Array<Record<string, string>>
  ): Promise<FormattedDataFeedDocument> {
    const formattedDataFeed: FormattedDataFeedDocument =
      new FormattedDataFeedModel({
        feedId: feedId,
        data: data,
      });
    return saveFormattedDataFeedToDb(formattedDataFeed);
  }
  filterCsvDataByGlobalRules(
    csvData: ParsedCsvData,
    globalRules: MappingOperationConditions[]
  ): ParsedCsvData {
    return csvData.filter((dataRow) =>
      evaluateConditions(globalRules, dataRow)
    );
  }
}

export { FeedProcessingMediator };
