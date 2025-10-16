// src/routes/auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema'; 

const authRoutes = Router();
const authController = new AuthController();

// Aplica a validação à rota de login
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.post('/register', validate(registerSchema), authController.register);

authRoutes.get('/me', authMiddleware, authController.getProfile);

export default authRoutes;