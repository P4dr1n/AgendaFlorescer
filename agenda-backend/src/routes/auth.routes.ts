// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRoutes = Router();
const authController = new AuthController();

// Rota: POST /api/auth/login
// Esta rota será responsável por autenticar o usuário.
authRoutes.post('/login', authController.login);

authRoutes.post('/register', authController.register);

export default authRoutes;