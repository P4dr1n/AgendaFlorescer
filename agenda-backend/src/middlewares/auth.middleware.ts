// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

interface TokenPayload {
  id: string;
  usuario: string;
  role: Role; // O payload agora contém a 'role'
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo do JWT não foi configurado no servidor.');
    }

    const data = jwt.verify(token, jwtSecret);
    const { id, role, usuario } = data as TokenPayload;

    (req as any).userId = id;
    (req as any).userRole = role; 
    (req as any).userName = usuario;

    return next();
  } catch {
    return res.sendStatus(401);
  }
}