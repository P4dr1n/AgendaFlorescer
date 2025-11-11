// src/controllers/agendamento.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AgendamentoService } from '../services/agendamento.service';

export class AgendamentoController {
  private agendamentoService = new AgendamentoService();

  // criarAgendamento, listarAgendamentos, cancelarAgendamento (sem alterações)
  public criarAgendamento = async (req: Request, res: Response, next: NextFunction): Promise<void> => { try { const { servicoId, data, profissionalId } = req.body; const clienteId = (req as any).userId; if (!servicoId || !data || !profissionalId) { res.status(400).json({ message: 'O ID do serviço, o ID do profissional e a data são obrigatórios.' }); return; } const novoAgendamento = await this.agendamentoService.criar({ clienteId, servicoId, profissionalId, data }); res.status(201).json(novoAgendamento); } catch (error: any) { next(error); } };
  public listarAgendamentos = async (req: Request, res: Response, next: NextFunction): Promise<void> => { try { const clienteId = (req as any).userId; const agendamentos = await this.agendamentoService.listarPorCliente(clienteId); res.status(200).json(agendamentos); } catch (error: any) { next(error); } };
  public cancelarAgendamento = async (req: Request, res: Response, next: NextFunction): Promise<void> => { try { const { id } = req.params; const clienteId = (req as any).userId; const agendamentoCancelado = await this.agendamentoService.cancelar(id, clienteId); res.status(200).json(agendamentoCancelado); } catch (error: any) { next(error); } };

  // listarTodosAgendamentos, atualizarStatusAgendamento (Admin - sem alterações)
  public listarTodosAgendamentos = async (req: Request, res: Response, next: NextFunction): Promise<void> => { try { const agendamentos = await this.agendamentoService.listarTodos(); res.status(200).json(agendamentos); } catch (error: any) { next(error); } };
  public atualizarStatusAgendamento = async (
    req: Request, 
    res: Response, 
    next: NextFunction): Promise<void> => { 
      try 
      { 
       const { id } = req.params; 
       const { status } = req.body; 
       
       if (!status) { 
        res.status(400).json({ message: 'O novo status é obrigatório.' }); 
        return; 
      } 
      const agendamento = await this.agendamentoService.atualizarStatus(id, status); 
      res.status(200).json(agendamento); } 
      catch (error: any) { next(error); } 
    };


  public listarHorariosDisponiveis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, servicoId } = req.query;

    if (!data || !servicoId) {
      res.status(400).json({ 
        message: 'Parâmetros "data" (YYYY-MM-DD) e "servicoId" são obrigatórios' 
      });
      return;
    }

    const horarios = await this.agendamentoService.listarHorariosDisponiveis(
      data as string,
      servicoId as string
    );

    res.json(horarios);
  } catch (error) {
    next(error);
  };
}
  public listarDisponibilidade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data, servicoId } = req.query; // Pega os parâmetros da URL (?data=...&servicoId=...)

      if (!data || typeof data !== 'string') {
        res.status(400).json({ message: 'O parâmetro "data" (AAAA-MM-DD) é obrigatório.' });
        return;
      }
      if (!servicoId || typeof servicoId !== 'string') {
        res.status(400).json({ message: 'O parâmetro "servicoId" é obrigatório.' });
        return;
      }

      const horarios = await this.agendamentoService.listarHorariosDisponiveis(data, servicoId);
      res.status(200).json(horarios);
    } catch (error) {
      next(error); // Deixa o middleware de erro tratar
    }
    
  };
  public listarPorProfissional = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { profissionalId } = req.params;
    const { data } = req.query; // Opcional: filtrar por data específica

    const agendamentos = await this.agendamentoService.listarPorProfissional(
      profissionalId,
      data as string | undefined
    );

    res.json(agendamentos);
  } catch (error) {
    next(error);
  }
};
  
}