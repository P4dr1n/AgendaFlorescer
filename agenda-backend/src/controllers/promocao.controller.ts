// src/controllers/promocao.controller.ts

import { Request, Response, NextFunction } from 'express';
import { PromocaoService } from '../services/promocao.service';

export class PromocaoController {
  private promocaoService = new PromocaoService();

  public criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validação básica dos dados de entrada
      const { titulo, descricao, descontoPercentual, dataInicio, dataFim } = req.body;
      if (!titulo || !descontoPercentual || !dataInicio || !dataFim) {
         res.status(400).json({ message: 'Título, desconto, data de início e data de fim são obrigatórios.' });
         return;
      }
      // Validações adicionais (ex: desconto > 0, dataFim > dataInicio) podem ser adicionadas
      const novaPromocao = await this.promocaoService.criar(req.body);
      res.status(201).json(novaPromocao);
    } catch (error) {
      next(error);
    }
  };

  public listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const promocoes = await this.promocaoService.listarTodas();
      res.status(200).json(promocoes);
    } catch (error) {
      next(error);
    }
  };

  public atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dados = req.body;
      if (Object.keys(dados).length === 0) {
          res.status(400).json({ message: 'Nenhum dado fornecido para atualização.'});
          return;
      }
      const promocaoAtualizada = await this.promocaoService.atualizar(id, dados);
      res.status(200).json(promocaoAtualizada);
    } catch (error) {
      next(error);
    }
  };

  public deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.promocaoService.deletar(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}