// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define uma interface para o payload do nosso token
interface TokenPayload {
  id: string;
  usuario: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. Pega o cabeçalho de autorização da requisição
  const { authorization } = req.headers;

  if (!authorization) {
    // Se não houver cabeçalho, retorna erro 401 (Não Autorizado)
    return res.sendStatus(401);
  }

  // 2. O token vem no formato "Bearer eyJhbGciOi...".
  //    Separamos o "Bearer" do token em si.
  const token = authorization.replace('Bearer', '').trim();

  try {
    // 3. Verifica se o token é válido usando o nosso segredo
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo do JWT não foi configurado no servidor.');
    }

    const data = jwt.verify(token, jwtSecret);
    const { id, usuario } = data as TokenPayload;

    // 4. Se o token for válido, adicionamos os dados do utilizador à requisição.
    //    Isso permite que as próximas funções (nos controllers) saibam quem é o utilizador.
    //    (Vamos ajustar os tipos do Express para reconhecer 'req.userId' e 'req.userName')
    (req as any).userId = id;
    (req as any).userName = usuario;


    // 5. Chama a próxima função na cadeia (o nosso controller da rota)
    return next();
  } catch {
    // Se jwt.verify falhar (token inválido, expirado, etc.), retorna erro 401
    return res.sendStatus(401);
  }
}