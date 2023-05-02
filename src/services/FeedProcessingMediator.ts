import { Readable } from 'stream';
import { parseCsvData } from './CsvParsingService';
import {
  fetchDataFeedConfigurationFromDb,
  saveFormattedDataFeedToDb,
} from './DatabaseService';
import { FormattedDataFeedDocument, FormattedDataFeedModel } from '../models/FormattedDataFeedSchema';
import { applyMappingsToCsvData } from './MappingOperationProcessingService';
import type { MappingData } from '../shared/types';

class FeedProcessingMediator {
  // Main entry point for business logic
  async processData(stream: Readable, feedId: string): Promise<boolean> {
    try {
      const csvData = await parseCsvData(stream);
      const doc = await fetchDataFeedConfigurationFromDb(feedId);
      const formattedData = applyMappingsToCsvData(
        csvData,
        doc.mappingsData as MappingData[],
        doc.globalRules
      );
      const savedToDb = await this.saveFormattedData(feedId, formattedData);
      console.log(savedToDb)
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
    return saveFormattedDataFeedToDb(formattedDataFeed)
  }
}

export { FeedProcessingMediator };
