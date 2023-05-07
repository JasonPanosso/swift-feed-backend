import { Request, Response } from 'express';
import { RequestWithUser } from '../shared/types';
import { validationResult } from 'express-validator';
import { userLogin, userRegister } from '../services/AuthService';

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const token = await userRegister(email, password);
    res.json({ token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const token = await userLogin(email, password);
    res.json({ token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}

export const checkLoggedIn = (req: RequestWithUser, res: Response) => {
  if (req.user) {
    res.status(200).send({ loggedIn: true, user: req.user });
  } else {
    res.status(401).send({ loggedIn: false });
  }
};
