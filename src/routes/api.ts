import express from 'express';
import dataFeedConfigurationRouter from '../controllers/DataFeedConfigurationController';
import formattedDataFeedRouter from '../controllers/FormattedDataFeedController';

const router = express.Router();

router.use('/datafeedconfiguration', dataFeedConfigurationRouter);
router.use('/formatteddatafeed', formattedDataFeedRouter);

export default router;
