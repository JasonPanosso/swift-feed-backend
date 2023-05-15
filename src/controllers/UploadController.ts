import { Request, Response } from 'express';
import { Readable } from 'stream';
import { processDataFeed } from '../services/DataFeedProcessorService';

export const uploadTextData = async (req: Request, res: Response) => {
  try {
    const feedId = req.params.feedId;
    const readableStream = Readable.from(req.body);

    const result = await processDataFeed(readableStream, feedId);
    result.success
      ? res.status(200).json({ message: result.message })
      : res.status(500).json({ message: result.message, error: result.error });
  } catch (err) {
    res.status(500).json({ message: 'Error processing text data', error: err });
    console.error(err);
  }
};
