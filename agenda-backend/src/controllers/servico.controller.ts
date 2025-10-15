// src/controllers/servico.controller.ts

import { Request, Response } from 'express';
import { ServicoService } from '../services/servico.service';

export class ServicoController {
  private servicoService = new ServicoService();

  public criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { nome, descricao, preco, duracao } = req.body;
      if (!nome || !preco || !duracao) {
        return res.status(400).json({ message: 'Nome, preço e duração são obrigatórios.' });
      }

      const novoServico = await this.servicoService.criar({ nome, descricao, preco, duracao });
      return res.status(201).json(novoServico);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  public listar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const servicos = await this.servicoService.listarTodos();
      return res.status(200).json(servicos);
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao buscar serviços.' });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dados = req.body;
      const servicoAtualizado = await this.servicoService.atualizar(id, dados);
      return res.status(200).json(servicoAtualizado);
    } catch (error: any) {
      return res.status(404).json({ message: error.message }); // 404 se o serviço não for encontrado
    }
  };

  public deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await this.servicoService.deletar(id);
      // Retorna uma resposta vazia com status 204 (No Content) para sucesso
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ message: error.message }); // 404 se o serviço não for encontrado
    }
  };
}