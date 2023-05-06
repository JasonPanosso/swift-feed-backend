import express from 'express';
import { getFormattedDataFeed } from '../controllers/FormattedDataFeedController';

const router = express.Router();

router.get('/:feedId', getFormattedDataFeed);

export default router;
