// src/middlewares/error.middleware.ts

import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../errors/ApiError';

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('Erro na API:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({ message: error.message });
  }

  const message = error instanceof Error ? error.message : 'Erro interno do servidor.';
  return res.status(500).json({ message });
}