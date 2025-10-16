// src/routes/servico.routes.ts

import { Router } from 'express';
import { ServicoController } from '../controllers/servico.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { criarServicoSchema } from '../schemas/servico.schema';

const servicoRoutes = Router();
const servicoController = new ServicoController();

servicoRoutes.get('/', servicoController.listar);

// Aplica a validação à rota de criação de serviço
servicoRoutes.post('/', authMiddleware, adminMiddleware, validate(criarServicoSchema), servicoController.criar);
servicoRoutes.put('/:id', authMiddleware, adminMiddleware, servicoController.atualizar);
servicoRoutes.delete('/:id', authMiddleware, adminMiddleware, servicoController.deletar);

export default servicoRoutes;