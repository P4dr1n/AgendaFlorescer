// src/middlewares/error.middleware.ts

import { NextFunction, Request, Response } from 'express';

// Documentação do Middleware de Erro:
// Este é um middleware especial do Express que tem 4 argumentos.
// Ele é acionado sempre que um erro é lançado em qualquer rota.
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Um erro ocorreu:', error); // É uma boa prática registar o erro no servidor

  // Define uma mensagem e um status padrão para erros genéricos
  const message = error.message || 'Erro interno do servidor.';
  const statusCode = 500; // Internal Server Error

  // Envia uma resposta JSON padronizada para o cliente
  return res.status(statusCode).json({
    status: 'error',
    message: message,
  });
}