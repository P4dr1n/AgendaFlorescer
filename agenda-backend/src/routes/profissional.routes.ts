// src/routes/profissional.routes.ts

import { Router } from 'express';
import { ProfissionalController } from '../controllers/profissional.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const profissionalRoutes = Router();
const profissionalController = new ProfissionalController();

// --- ROTA PÚBLICA ---
// Qualquer pessoa (incluindo clientes não logados) pode ver a lista de profissionais.
profissionalRoutes.get('/', profissionalController.listar);

// --- ROTAS PROTEGIDAS PARA ADMINS ---
// Apenas administradores podem criar, atualizar ou deletar profissionais.
profissionalRoutes.post('/', authMiddleware, adminMiddleware, profissionalController.criar);
profissionalRoutes.put('/:id', authMiddleware, adminMiddleware, profissionalController.atualizar);
profissionalRoutes.delete('/:id', authMiddleware, adminMiddleware, profissionalController.deletar);

export default profissionalRoutes;