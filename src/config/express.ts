import express from 'express';

export const expressConfig = {
  expressPort: process.env.EXPRESS_PORT || 3000,
};

export const setupExpress = (): express.Application => {
  const app = express();

  // TODO middleware/routes
  return app;
};
