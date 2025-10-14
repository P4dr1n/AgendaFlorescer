// src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Importa o middleware

const authRoutes = Router();
const authController = new AuthController();

// --- ROTAS PÚBLICAS (não precisam de token) ---
authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);

// --- ROTAS PROTEGIDAS (precisam de token) ---
// Qualquer requisição para /me passará primeiro pelo authMiddleware.
// Se o token for válido, a requisição continua para authController.getProfile.
// Se não, o middleware bloqueará a requisição com um erro 401.
authRoutes.get('/me', authMiddleware, authController.getProfile);

export default authRoutes;