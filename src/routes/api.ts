import express from 'express';
import dataFeedConfigurationRouter from '../routes/dataFeedConfigurationRoutes';
import formattedDataFeedRouter from '../routes/formattedDataFeedRoutes';
import authRoutes from './authRoutes';
import uploadRoutes from './uploadRoutes';
import { authMiddleware, hasRole } from '../middlewares/AuthMiddleware';
import { textDataMiddleware } from '../middlewares/TextDataMiddleware';

const router = express.Router();

router.use(
  '/datafeedconfiguration',
  authMiddleware,
  hasRole('editor'),
  dataFeedConfigurationRouter
);
router.use('/formatteddatafeed', formattedDataFeedRouter);
router.use('/upload', textDataMiddleware, uploadRoutes)
router.use('/auth', authRoutes);

export default router;
