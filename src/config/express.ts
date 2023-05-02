import express from 'express';
import { fetchTsvRouter } from '../routes/fetchTsv';
import { config } from './config';

export const expressConfig = {
  expressPort: config.expressPort || 3000,
};

export const setupExpress = async (): Promise<void> => {
  const app = express();

  app.use(express.json());

  // temp test
  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  app.get('/api/fetchTsv/:feedId', fetchTsvRouter);

  app.listen(expressConfig.expressPort, () => {
    console.log(`Express running on port ${expressConfig.expressPort}`);
  });
};
