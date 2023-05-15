import { Request, Response, NextFunction } from 'express';

export const textDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = req.headers['content-type'];

  if (
    ['text/csv', 'text/tab-separated-values'].includes(contentType as string)
  ) {
    let data = '';

    req.on('data', (chunk: Buffer) => {
      data += chunk;
    });

    req.on('end', () => {
      req.body = data;
      next();
    });
  } else {
    res.status(400).json({ message: 'Invalid content type' });
  }
};
