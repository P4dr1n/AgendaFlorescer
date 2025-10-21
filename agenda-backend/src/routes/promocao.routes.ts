// src/routes/promocao.routes.ts

import { Router } from 'express';
import { PromocaoController } from '../controllers/promocao.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const promocaoRoutes = Router();
const promocaoController = new PromocaoController();

// --- ROTA PÚBLICA ---
// Qualquer pessoa pode listar as promoções.
// Poderíamos adicionar filtros aqui no futuro (ex: /promocoes?ativas=true)
promocaoRoutes.get('/', promocaoController.listar);

// --- ROTAS PROTEGIDAS PARA ADMINS ---
promocaoRoutes.post('/', authMiddleware, adminMiddleware, promocaoController.criar);
promocaoRoutes.put('/:id', authMiddleware, adminMiddleware, promocaoController.atualizar);
promocaoRoutes.delete('/:id', authMiddleware, adminMiddleware, promocaoController.deletar);

export default promocaoRoutes;