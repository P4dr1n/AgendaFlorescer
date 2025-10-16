// src/schemas/servico.schema.ts

import { z } from 'zod';

export const criarServicoSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(1, { message: 'O nome do serviço é obrigatório.' }),

    descricao: z
      .string()
      .optional(),

    // ✅ CORREÇÃO: A verificação de obrigatoriedade é implícita
    preco: z
      .number()
      .positive({ message: 'O preço deve ser um valor positivo.' }),

    duracao: z
      .number()
      .int({ message: 'A duração deve ser um número inteiro.' })
      .positive({ message: 'A duração deve ser um valor positivo.' }),
  }),
});