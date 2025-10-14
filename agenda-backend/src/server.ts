// src/server.ts

import express from 'express';
import authRoutes from './routes/auth.routes';
import agendamentoRoutes from './routes/agendamento.routes'; // 1. Importa as rotas de agendamento

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Roteadores
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes); // 2. Usa as novas rotas com o prefixo /api/agendamentos

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});