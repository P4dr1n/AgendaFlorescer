// src/schemas/agendamento.schema.ts

import { z } from 'zod';

export const criarAgendamentoSchema = z.object({
  body: z.object({
    servicoId: z
      .string()
      .uuid({ message: 'O ID do serviço deve ser um UUID válido.' }),

    data: z
      .string()
      .datetime({ message: 'A data deve estar no formato ISO 8601.' }),
  }),
});