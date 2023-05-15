import express from 'express';
import { uploadTextData } from '../controllers/UploadController';

const router = express.Router();

router.post('/:feedId', uploadTextData);

export default router;
