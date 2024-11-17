import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Unauthorized' });
  }
};
