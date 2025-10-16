// src/middlewares/error.middleware.ts

import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';
import { Prisma } from '@prisma/client';

export function errorMiddleware(
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Um erro foi capturado:', error);

  // Se o erro for uma instância da nossa ApiError, usamos o statusCode dela.
  // Caso contrário, o padrão é 500 (Erro Interno do Servidor).
  const statusCode = error.statusCode ?? 500;
  let message = error.statusCode ? error.message : 'Erro interno do servidor.';

  // Tratamento específico para erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Código P2002: Violação de restrição única (ex: email ou usuário já existe)
    if (error.code === 'P2002') {
      return res.status(409).json({ // 409 Conflict
        status: 'error',
        message: `O campo '${(error.meta as any)?.target?.join(', ')}' já está em uso.`,
      });
    }
    // Código P2025: Registo não encontrado numa operação (ex: update ou delete)
    if (error.code === 'P2025') {
        return res.status(404).json({ // 404 Not Found
            status: 'error',
            message: 'O recurso solicitado não foi encontrado.',
        });
    }
  }

  return res.status(statusCode).json({
    status: 'error',
    message: message,
  });
}