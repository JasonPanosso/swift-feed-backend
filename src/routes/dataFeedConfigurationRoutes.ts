import express from 'express';
import {
  getAllDataFeedConfigurationsForUser,
  getDataFeedConfiguration,
  createDataFeedConfiguration,
  putDataFeedConfiguration,
  deleteDataFeedConfiguration,
} from '../controllers/DataFeedConfigurationController';

const router = express.Router();

router.get('/user', getAllDataFeedConfigurationsForUser);
router.get('/:feedId', getDataFeedConfiguration);
router.post('/create', createDataFeedConfiguration);
router.put('/:feedId', putDataFeedConfiguration);
router.delete('/:feedId', deleteDataFeedConfiguration);

export default router;
