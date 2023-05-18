import https from 'https';
import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/api';
import { config } from '../config/config';
import fs from 'fs';

const EXPRESS_PORT = config.expressPort || 3000;

export const setupExpress = async (): Promise<void> => {
  const app = express();

  app.use(
    cors({
      // TODO change this and change cors per route? zz
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
  app.use(express.json());
  app.use('/api', apiRouter);

  if (config.httpsEnabled && config.sslPrivateKey && config.sslCert) {
    https
      .createServer(
        {
          key: fs.readFileSync(config.sslPrivateKey),
          cert: fs.readFileSync(config.sslCert),
        },
        app
      )
      .listen(EXPRESS_PORT, () => {
        console.log(`Express running on port ${EXPRESS_PORT}`);
      });
  } else {
    app.listen(EXPRESS_PORT, () => {
      console.log(`Express running on port ${EXPRESS_PORT}`);
    });
  }
};
