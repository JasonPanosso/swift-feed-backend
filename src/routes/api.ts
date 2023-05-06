import express from 'express';
import dataFeedConfigurationRouter from '../routes/dataFeedConfigurationRoutes';
import formattedDataFeedRouter from '../routes/formattedDataFeedRoutes';
import authRoutes from './authRoutes';
import { authMiddleware, hasRole } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.use(
  '/datafeedconfiguration',
  authMiddleware,
  hasRole('editor'),
  dataFeedConfigurationRouter
);
router.use('/formatteddatafeed', formattedDataFeedRouter);
router.use('/auth', authRoutes);

export default router;
