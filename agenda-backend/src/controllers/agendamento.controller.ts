// src/controllers/agendamento.controller.ts
import { Request, Response } from 'express';
import { AgendamentoService } from '../services/agendamento.service';

export class AgendamentoController {
  private agendamentoService = new AgendamentoService();

  public criarAgendamento = async (req: Request, res: Response): Promise<Response> => {
    
    const { servicoId, data } = req.body;
    const clienteId = (req as any).userId;
    const novoAgendamento = await this.agendamentoService.criar({ clienteId, servicoId, data });
    return res.status(201).json(novoAgendamento);
  };

  
  public listarAgendamentos = async (req: Request, res: Response): Promise<Response> => {
    const clienteId = (req as any).userId;
    const agendamentos = await this.agendamentoService.listarPorCliente(clienteId);
    return res.status(200).json(agendamentos);
  };

  public cancelarAgendamento = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const clienteId = (req as any).userId;
    const agendamentoCancelado = await this.agendamentoService.cancelar(id, clienteId);
    return res.status(200).json(agendamentoCancelado);
  };

  public listarTodosAgendamentos = async (req: Request, res: Response): Promise<Response> => {
    const agendamentos = await this.agendamentoService.listarTodos();
    return res.status(200).json(agendamentos);
  };

  public atualizarStatusAgendamento = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'O novo status é obrigatório.' });
    }
    const agendamento = await this.agendamentoService.atualizarStatus(id, status);
    return res.status(200).json(agendamento);
  };
}