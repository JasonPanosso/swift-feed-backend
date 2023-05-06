import express from 'express';
import dataFeedConfigurationRouter from '../routes/dataFeedConfigurationRoutes';
import formattedDataFeedRouter from '../routes/formattedDataFeedRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/datafeedconfiguration', dataFeedConfigurationRouter);
router.use('/formatteddatafeed', formattedDataFeedRouter);
router.use('/auth', authRoutes)

export default router;
