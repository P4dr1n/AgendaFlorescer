// src/server.ts

import express from 'express';
import authRoutes from './routes/auth.routes';
import agendamentoRoutes from './routes/agendamento.routes';
import servicoRoutes from './routes/servico.routes';
import profissionalRoutes from './routes/profissional.routes';
import promocaoRoutes from './routes/promocao.routes'; // 1. Importa as rotas de promoção
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Roteadores
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/promocoes', promocaoRoutes); // 2. Usa as novas rotas

// Middleware de erro (deve ser o último)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});