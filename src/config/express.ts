import express from 'express';

export const expressConfig = {
  expressPort: process.env.EXPRESS_PORT || 3000,
};

export const setupExpress = async (): Promise<express.Application> => {
  const app = express();

  // TODO middleware/routes
  return app;
};
