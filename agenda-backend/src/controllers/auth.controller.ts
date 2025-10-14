// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
      }

      const token = await this.authService.login(usuario, senha);

      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuario, email, senha, telefone } = req.body;

      if (!usuario || !email || !senha) {
        return res.status(400).json({ message: 'Usuário, email e senha são obrigatórios.' });
      }

      // Esta chamada agora corresponde perfeitamente ao tipo 'RegisterData' esperado pelo serviço
      const novoUsuario = await this.authService.register({ usuario, email, senha, telefone });

      return res.status(201).json({ id: novoUsuario.id, usuario: novoUsuario.usuario, email: novoUsuario.email });
    } catch (error: any) {
      // Usaremos um status 409 (Conflict) para erros como "usuário já existe"
      return res.status(409).json({ message: error.message });
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as any).userId;
    const userName = (req as any).userName;
    
    return res.json({ id: userId, usuario: userName, message: 'Token válido!' });
  };
}