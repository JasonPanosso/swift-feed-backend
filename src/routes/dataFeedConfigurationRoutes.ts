import express from 'express';
import {
  getAllDataFeedConfigurations,
  getDataFeedConfiguration,
  createDataFeedConfiguration,
  updateDataFeedConfiguration,
  deleteDataFeedConfiguration,
} from '../controllers/DataFeedConfigurationController';

const router = express.Router();

router.get('/user/:userId', getAllDataFeedConfigurations);
router.get('/:id', getDataFeedConfiguration);
router.post('/', createDataFeedConfiguration);
router.put('/:id', updateDataFeedConfiguration);
router.delete('/:id', deleteDataFeedConfiguration);

export default router;
