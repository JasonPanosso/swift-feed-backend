import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/api';
import { config } from '../config/config';

const EXPRESS_PORT = config.expressPort || 3000;

export const setupExpress = async (): Promise<void> => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRouter);

  app.listen(EXPRESS_PORT, () => {
    console.log(`Express running on port ${EXPRESS_PORT}`);
  });
};
