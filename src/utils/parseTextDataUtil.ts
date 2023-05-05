import Papa from 'papaparse';
import { Readable } from 'stream';
import { ParsedData } from '../shared/types'

export const parseTextData = (stream: Readable): Promise<ParsedData> => {
  const results: ParsedData = [];
  return new Promise((resolve, reject) => {
    stream
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }))
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
