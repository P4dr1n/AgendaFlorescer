// src/services/auth.service.ts

import { PrismaClient, User, Role } from '@prisma/client'; // Importa o tipo Role
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterData {
  usuario: string;
  email: string;
  senha: string;
  telefone?: string | null;
}

export class AuthService {
  public async login(usuario: string, senha: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { usuario: usuario },
    });

    if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
      throw new Error('Usuário ou senha inválidos.');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo do JWT não está configurado no servidor.');
    }

    // ✅ Adiciona a 'role' do utilizador ao payload do token
    const payload = {
      id: user.id,
      usuario: user.usuario,
      role: user.role, // A função do utilizador é incluída aqui
    };

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
        // O campo 'role' não é necessário aqui, pois o Prisma usará o valor padrão 'CLIENTE'
      },
    });

    const { senhaHash: _, ...userSemSenha } = novoUsuario;

    console.log('Novo usuário salvo no banco de dados:', userSemSenha);
    return userSemSenha;
  }
}