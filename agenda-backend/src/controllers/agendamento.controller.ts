// src/controllers/agendamento.controller.ts

import { Request, Response } from 'express';
import { AgendamentoService } from '../services/agendamento.service';

export class AgendamentoController {
  private agendamentoService = new AgendamentoService();

  public criarAgendamento = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { servicoId, data } = req.body;
      const clienteId = (req as any).userId; // ID do utilizador vem do token (middleware)

      if (!servicoId || !data) {
        return res.status(400).json({ message: 'O ID do serviço e a data são obrigatórios.' });
      }

      const novoAgendamento = await this.agendamentoService.criar({
        clienteId,
        servicoId,
        data,
      });

      return res.status(201).json(novoAgendamento);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  public listarAgendamentos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const clienteId = (req as any).userId; // ID do utilizador vem do token
      const agendamentos = await this.agendamentoService.listarPorCliente(clienteId);
      return res.status(200).json(agendamentos);
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
    }
  };
}