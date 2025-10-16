// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<Response> => {
    
    const { usuario, senha } = req.body;
    const token = await this.authService.login(usuario, senha);
    return res.status(200).json({ token });
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    const { usuario, email, senha, telefone } = req.body;
    const novoUsuario = await this.authService.register({ usuario, email, senha, telefone });
    return res.status(201).json({ id: novoUsuario.id, usuario: novoUsuario.usuario, email: novoUsuario.email });
  };

  public getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as any).userId;
    const userName = (req as any).userName;
    return res.json({ id: userId, usuario: userName, message: 'Token válido!' });
  };
}