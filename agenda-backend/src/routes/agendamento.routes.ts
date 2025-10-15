// src/routes/agendamento.routes.ts

import { Router } from 'express';
import { AgendamentoController } from '../controllers/agendamento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const agendamentoRoutes = Router();
const agendamentoController = new AgendamentoController();

// --- ROTAS DE CLIENTE (requerem apenas login) ---
agendamentoRoutes.post('/', authMiddleware, agendamentoController.criarAgendamento);
agendamentoRoutes.get('/', authMiddleware, agendamentoController.listarAgendamentos);
agendamentoRoutes.patch('/:id/cancelar', authMiddleware, agendamentoController.cancelarAgendamento);

// --- ROTAS DE ADMIN (requerem login + permissão de admin) ---
agendamentoRoutes.get('/todos', authMiddleware, adminMiddleware, agendamentoController.listarTodosAgendamentos);
agendamentoRoutes.patch('/:id/status', authMiddleware, adminMiddleware, agendamentoController.atualizarStatusAgendamento);

export default agendamentoRoutes;