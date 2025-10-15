// src/server.ts

import express from 'express';
// ✅ A linha 'import 'express-async-errors';' FOI REMOVIDA.

import authRoutes from './routes/auth.routes';
import agendamentoRoutes from './routes/agendamento.routes';
import servicoRoutes from './routes/servico.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Roteadores
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/servicos', servicoRoutes);

// O middleware de erro continua a ser o último 'app.use'.
// O Express 5 irá agora redirecionar os erros async para aqui automaticamente.
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});