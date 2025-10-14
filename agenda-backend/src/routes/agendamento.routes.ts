// src/routes/agendamento.routes.ts

import { Router } from 'express';
import { AgendamentoController } from '../controllers/agendamento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const agendamentoRoutes = Router();
const agendamentoController = new AgendamentoController();

// Aplica o middleware de autenticação a TODAS as rotas deste arquivo
agendamentoRoutes.use(authMiddleware);

// Rota para criar um novo agendamento
agendamentoRoutes.post('/', agendamentoController.criarAgendamento);

// Rota para listar os agendamentos do utilizador logado
agendamentoRoutes.get('/', agendamentoController.listarAgendamentos);

export default agendamentoRoutes;