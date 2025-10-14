// src/server.ts
import express from 'express';
import authRoutes from './routes/auth.routes'; // Importa nossas novas rotas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Diz ao Express para usar o nosso arquivo de rotas para qualquer
// requisição que comece com "/api/auth".
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});