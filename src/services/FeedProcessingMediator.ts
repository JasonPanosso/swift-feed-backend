import { Readable } from 'stream';
import { parseCsvData } from './CsvParsingService';
import applyMappings from './MappingOperationProcessingService';

class FeedProcessingMediator {

  // Main entry point for business logic
  async processDataFeed(stream: Readable, feedId: string): Promise<void> {
    const csvData = await parseCsvData(stream);
    console.log(csvData)
  }
}

export { FeedProcessingMediator };
