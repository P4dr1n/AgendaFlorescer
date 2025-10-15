// src/routes/servico.routes.ts

import { Router } from 'express';
import { ServicoController } from '../controllers/servico.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware'; // 1. Importa o novo middleware

const servicoRoutes = Router();
const servicoController = new ServicoController();

// --- ROTA PÚBLICA ---
servicoRoutes.get('/', servicoController.listar);

// --- ROTAS PROTEGIDAS PARA ADMINS ---
// 2. Adicionamos o 'adminMiddleware' depois do 'authMiddleware'.
// A requisição primeiro verifica se o utilizador está logado, e depois se é um admin.
servicoRoutes.post('/', authMiddleware, adminMiddleware, servicoController.criar);
servicoRoutes.put('/:id', authMiddleware, adminMiddleware, servicoController.atualizar);
servicoRoutes.delete('/:id', authMiddleware, adminMiddleware, servicoController.deletar);

export default servicoRoutes;