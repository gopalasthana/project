import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
