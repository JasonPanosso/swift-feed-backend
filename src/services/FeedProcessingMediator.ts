import { Readable } from 'stream';
import { parseCsvData } from './CsvParsingService';
import { fetchDataFeedConfigurationFromDb } from './DatabaseService';
import {
  applyMappingsToCsvData,
  evaluateConditions,
} from './MappingOperationProcessingService';
import type {
  ParsedCsvData,
  MappingOperationConditions,
  MappingData,
} from '../shared/types';

class FeedProcessingMediator {
  // Main entry point for business logic
  async processData(stream: Readable, feedId: string): Promise<boolean> {
    try {
      const csvData = await parseCsvData(stream);
      const doc = await fetchDataFeedConfigurationFromDb(feedId);
      const filteredCsvData = this.filterCsvData(csvData, doc.globalRules);
      const dataGoogleFeedFormatted = applyMappingsToCsvData(
        filteredCsvData,
        doc.mappingsData as MappingData[]
      );
      console.log(dataGoogleFeedFormatted);
    } catch (error) {
      console.error('Error during data processing:', error);
      return false
    }

    return true
  }

  filterCsvData(
    csvData: ParsedCsvData,
    globalRules: MappingOperationConditions[]
  ): ParsedCsvData {
    return csvData.filter((dataRow) => {
      evaluateConditions(globalRules, dataRow);
    });
  }
}

export { FeedProcessingMediator };
