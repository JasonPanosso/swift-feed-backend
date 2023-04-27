import csv from 'csv-parser';
import { ReadStream } from 'fs';

type ParsedCsvData = Array<Record<string, string>>;

export default function parseCsvData(stream: ReadStream): ParsedCsvData {
  const results: ParsedCsvData = [];
  stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // TODO put logger stuff here :))
      console.log(results);
    });
  return results;
}
