// src/services/auth.service.ts

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// ✅ CORREÇÃO AQUI:
// Este tipo agora representa os dados que REALMENTE vêm do controlador.
// Não inclui 'senhaHash', pois é responsabilidade deste serviço criá-la.
interface RegisterData {
  usuario: string;
  email: string;
  senha: string;
  telefone?: string | null;
}

export class AuthService {
  public async login(usuario: string, senha: string): Promise<string> {
    console.log(`Validando credenciais para: ${usuario}`);

    const user = await prisma.user.findUnique({
      where: {
        usuario: usuario,
      },
    });

    if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
      throw new Error('Usuário ou senha inválidos.');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo do JWT não está configurado no servidor.');
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      jwtSecret,
      { expiresIn: '8h' }
    );

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

    console.log('Novo usuário salvo no banco de dados:', userSemSenha);
    return userSemSenha;
  }
}