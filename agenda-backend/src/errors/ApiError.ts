// src/errors/ApiError.ts

// Documentação da Classe ApiError:
// Esta classe permite-nos criar erros personalizados que contêm
// um 'statusCode' HTTP, para que o nosso middleware de erro
// saiba qual status retornar na resposta da API.
export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Exemplos de classes de erro específicas para reutilização
export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}