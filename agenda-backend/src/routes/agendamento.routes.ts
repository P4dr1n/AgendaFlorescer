// src/routes/agendamento.routes.ts

import { Router } from 'express';
import { AgendamentoController } from '../controllers/agendamento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { criarAgendamentoSchema } from '../schemas/agendamento.schema';

const agendamentoRoutes = Router();
const agendamentoController = new AgendamentoController();

agendamentoRoutes.use(authMiddleware);

// Aplica a validação à rota de criação de agendamento
agendamentoRoutes.post('/', validate(criarAgendamentoSchema), agendamentoController.criarAgendamento);
agendamentoRoutes.get('/', agendamentoController.listarAgendamentos);
agendamentoRoutes.patch('/:id/cancelar', agendamentoController.cancelarAgendamento);

agendamentoRoutes.get('/todos', adminMiddleware, agendamentoController.listarTodosAgendamentos);
agendamentoRoutes.patch('/:id/status', adminMiddleware, agendamentoController.atualizarStatusAgendamento);

export default agendamentoRoutes;