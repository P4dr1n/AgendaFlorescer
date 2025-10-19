// src/schemas/auth.schema.ts

import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    nomeCompleto: z
      .string()
      .min(3, { message: 'O nome completo deve ter no mínimo 3 caracteres.' }),

    email: z
      .string()
      .email({ message: 'Por favor, insira um email válido.' }),

    senha: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),

    telefone: z
      .string()
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: 'O email é obrigatório.' }),

    senha: z
      .string()
      .min(1, { message: 'A senha é obrigatória.' }),
  }),
});