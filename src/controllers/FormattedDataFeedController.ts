import { Request, Response } from 'express';
import { getFormattedDataFeed as getFormattedDataFeedFromDb } from '../services/DatabaseService';
import { formatDataToTsv } from '../utils/tsvFormatUtil';

export const getFormattedDataFeed = async (req: Request, res: Response) => {
  const { feedId } = req.params;
  try {
    const doc = await getFormattedDataFeedFromDb(feedId);
    if (!doc) {
      res.status(404).send('Formatted data feed not found');
    }
    const tsv = formatDataToTsv(doc.data);
    res.set('Content-Type', 'text/tab-separated-values');
    res.status(200).send(tsv);
    console.log(`Successfully sent TSV for feedId: ${feedId}`);
  } catch (error) {
    console.error(`Error fetching TSV for feed with id ${feedId}:`, error);
    res.status(500).send('Internal Server Error');
  }
};
