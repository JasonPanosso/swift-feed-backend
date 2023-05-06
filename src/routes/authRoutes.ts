import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/AuthController';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  authController.login
);

export default router;
