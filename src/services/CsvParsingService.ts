import csv from 'csv-parser';
import { Readable } from 'stream';
import { ParsedCsvData } from '../shared/types'

export const parseCsvData = (stream: Readable): Promise<ParsedCsvData> => {
  const results: ParsedCsvData = [];
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // TODO put logger stuff here
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
