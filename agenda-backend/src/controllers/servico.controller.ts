// src/controllers/servico.controller.ts
import { Request, Response } from 'express';
import { ServicoService } from '../services/servico.service';

export class ServicoController {
  private servicoService = new ServicoService();

  public criar = async (req: Request, res: Response): Promise<Response> => {
    // ✅ Validação manual removida
    const { nome, descricao, preco, duracao } = req.body;
    const novoServico = await this.servicoService.criar({ nome, descricao, preco, duracao });
    return res.status(201).json(novoServico);
  };

  public listar = async (req: Request, res: Response): Promise<Response> => {
    const servicos = await this.servicoService.listarTodos();
    return res.status(200).json(servicos);
  };

  public atualizar = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const dados = req.body;
    const servicoAtualizado = await this.servicoService.atualizar(id, dados);
    return res.status(200).json(servicoAtualizado);
  };

  public deletar = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await this.servicoService.deletar(id);
    return res.status(204).send();
  };
}