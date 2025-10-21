// src/controllers/profissional.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ProfissionalService } from '../services/profissional.service';

export class ProfissionalController {
  private profissionalService = new ProfissionalService();

  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nome, especialidade } = req.body;
      if (!nome) {
        res.status(400).json({ message: 'O nome do profissional é obrigatório.' });
        return;
      }
      const novoProfissional = await this.profissionalService.criar({ nome, especialidade });
      res.status(201).json(novoProfissional);
    } catch (error) {
      next(error); // Envia para o middleware de erro
    }
  };

  public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profissionais = await this.profissionalService.listarTodos();
      res.status(200).json(profissionais);
    } catch (error) {
      next(error);
    }
  };

  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dados = req.body;
      // Verifica se pelo menos um campo foi enviado para atualização
      if (!dados.nome && !dados.especialidade) {
           res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
           return;
      }
      const profissionalAtualizado = await this.profissionalService.atualizar(id, dados);
      res.status(200).json(profissionalAtualizado);
    } catch (error) {
      next(error); // O middleware de erro tratará erros como 'não encontrado'
    }
  };

  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.profissionalService.deletar(id);
      res.status(204).send(); // Resposta vazia para sucesso na deleção
    } catch (error) {
      next(error); // O middleware de erro tratará erros como 'não encontrado'
    }
  };
}