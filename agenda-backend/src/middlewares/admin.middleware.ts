// src/middlewares/admin.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  // Este middleware deve ser usado DEPOIS do authMiddleware.
  // Assumimos que o 'authMiddleware' já validou o token e adicionou 'userRole'.
  const userRole = (req as any).userRole;

  if (userRole !== Role.ADMIN) {
    // Se o utilizador não for um ADMIN, retorna erro 403 (Forbidden / Proibido)
    return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }

  // Se for um ADMIN, permite que a requisição continue
  return next();
}