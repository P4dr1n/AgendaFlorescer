// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response): Promise<Response> => {

    const { email, senha } = req.body;
    const token = await this.authService.login(email, senha);
    return res.status(200).json({ token });
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    const { nomeCompleto, email, senha, telefone } = req.body;
    const novoUsuario = await this.authService.register({ nomeCompleto, email, senha, telefone });
    return res
      .status(201)
      .json({ id: novoUsuario.id, nomeCompleto: novoUsuario.nomeCompleto, email: novoUsuario.email });
  };

  public getProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as any).userId;
    const profile = await this.authService.getProfile(userId);
    return res.json(profile);
  };
}