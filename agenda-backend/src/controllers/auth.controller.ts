// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  // O "bind(this)" garante que o "this" dentro do método login
  // se refira à instância da classe AuthController.
  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
      }

      // Chama o serviço para realizar a lógica de login
      const token = await this.authService.login(usuario, senha);

      return res.status(200).json({ token });
    } catch (error: any) {
      // Se o serviço lançar um erro (ex: senha errada), ele é capturado aqui.
      return res.status(401).json({ message: error.message });
    }
  };
  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { usuario, email, senha, telefone } = req.body;

      if (!usuario || !email || !senha) {
        return res.status(400).json({ message: 'Usuário, email e senha são obrigatórios.' });
      }

      // Chama o serviço para criar o novo utilizador
      const novoUsuario = await this.authService.register({ usuario, email, senha, telefone });

      // Retorna uma resposta de sucesso sem dados sensíveis
      return res.status(201).json({ id: novoUsuario.id, usuario: novoUsuario.usuario, email: novoUsuario.email });
    } catch (error: any) {
      // Captura erros do serviço (ex: utilizador já existe)
      return res.status(409).json({ message: error.message });
    }
  };
}