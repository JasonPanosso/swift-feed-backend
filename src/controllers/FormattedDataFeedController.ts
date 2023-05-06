import express, { Request, Response } from 'express';
import { getFormattedDataFeedFromDb } from '../services/DatabaseService';
import { FormattedDataFeedDocument } from '../models/FormattedDataFeed';
import { formatDataToTsv } from '../utils/tsvFormatUtil';

const router = express.Router();

// GET a formatted data feed by feedId
router.get('/:feedId', async (req: Request, res: Response) => {
  const { feedId } = req.params;
  try {
    const doc: FormattedDataFeedDocument = await getFormattedDataFeedFromDb(
      feedId
    );
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
});

export default router;
