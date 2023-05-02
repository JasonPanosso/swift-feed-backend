import express, { Request, Response } from 'express';
import { fetchFormattedDataFeedFromDb } from '../services/DatabaseService';
import { FormattedDataFeedDocument } from '../models/FormattedDataFeedSchema';
import { formatDataToTsv } from '../utils/tsvFormatUtil';

const router = express.Router();

router.get('/api/fetchTsv/:feedId', async (req: Request, res: Response) => {
  const { feedId } = req.params;
  try {
    const doc: FormattedDataFeedDocument = await fetchFormattedDataFeedFromDb(
      feedId
    );
    const tsv = formatDataToTsv(doc.data);
    res.set('Content-Type', 'text/tab-separated-values');
    res.status(200).send(tsv);
    console.log(`Successfully sent TSV for feedId: ${feedId}`)
  } catch (error) {
    console.error(`Error fetching TSV for feed with id ${feedId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

export { router as fetchTsvRouter };
