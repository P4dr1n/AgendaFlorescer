// src/server.ts

import express from 'express';
import cors from 'cors'; // A importação do 'express-async-errors' foi removida

import authRoutes from './routes/auth.routes';
import agendamentoRoutes from './routes/agendamento.routes';
import servicoRoutes from './routes/servico.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Roteadores
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/servicos', servicoRoutes);

// Middleware de Erro (deve ser o último)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});