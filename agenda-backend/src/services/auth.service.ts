// src/services/auth.service.ts

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NotFoundError, UnauthorizedError } from '../errors/ApiError'; 

const prisma = new PrismaClient();

interface RegisterData {
  usuario: string;
  email: string;
  senha: string;
  telefone?: string | null;
}

export class AuthService {
  public async login(usuario: string, senha: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { usuario } });

    if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
      // ✅ Usa o erro com o status code 401
      throw new UnauthorizedError('Usuário ou senha inválidos.');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo do JWT não está configurado no servidor.');
    }

    const payload = { id: user.id, usuario: user.usuario, role: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '8h' });

    return token;
  }

  public async register(data: RegisterData): Promise<Omit<User, 'senhaHash'>> {
    const senhaHash = await bcrypt.hash(data.senha, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        usuario: data.usuario,
        email: data.email,
        senhaHash: senhaHash,
        telefone: data.telefone,
      },
    });

    const { senhaHash: _, ...userSemSenha } = novoUsuario;
    return userSemSenha;
  }

  public async getProfile(userId: string): Promise<Omit<User, 'senhaHash'>> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const { senhaHash: _, ...userSemSenha } = user;
    return userSemSenha;
  }
}