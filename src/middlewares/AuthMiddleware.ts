import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../shared/types';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const hasRole = (requiredRole: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRole = req.user.role;
    if (userRole !== requiredRole && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
