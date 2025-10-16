// src/services/agendamento.service.ts

import { PrismaClient, Agendamento } from '@prisma/client';
import { ApiError, ForbiddenError, NotFoundError } from '../errors/ApiError'; // Importa os erros

const prisma = new PrismaClient();

interface CriarAgendamentoDTO {
  clienteId: string;
  servicoId: string;
  data: string;
}

export class AgendamentoService {
  public async criar(dados: CriarAgendamentoDTO): Promise<Agendamento> {
    const servico = await prisma.servico.findUnique({
      where: { id: dados.servicoId },
    });

    if (!servico) {
      throw new NotFoundError('Serviço não encontrado.'); // ✅ Usa o erro 404
    }

    const dataInicio = new Date(dados.data);
    // ... (resto da lógica de verificação de conflito)
    const dataFim = new Date(dataInicio.getTime() + servico.duracao * 60000);
    const agendamentosConflitantes = await prisma.agendamento.findMany({
      where: { AND: [ { data: { gte: new Date(dataInicio.setHours(0, 0, 0, 0)), lt: new Date(dataInicio.setHours(23, 59, 59, 999)) } } ] },
      include: { servico: true },
    });
    const conflito = agendamentosConflitantes.find(ag => {
        const agInicio = ag.data;
        const agFim = new Date(agInicio.getTime() + ag.servico.duracao * 60000);
        return dataInicio < agFim && dataFim > agInicio;
    });

    if (conflito) {
      throw new ApiError('O horário solicitado já está ocupado.', 409); // ✅ Usa o erro 409 (Conflict)
    }

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: dataInicio,
        status: 'PENDENTE',
        cliente: { connect: { id: dados.clienteId } },
        servico: { connect: { id: dados.servicoId } },
      },
      include: { servico: true },
    });
    return novoAgendamento;
  }

  public async listarPorCliente(clienteId: string): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({
      where: { clienteId },
      include: { servico: true },
      orderBy: { data: 'asc' },
    });
  }

  public async cancelar(agendamentoId: string, clienteId: string): Promise<Agendamento> {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      throw new NotFoundError('Agendamento não encontrado.'); // ✅ Usa o erro 404
    }

    if (agendamento.clienteId !== clienteId) {
      throw new ForbiddenError('Não autorizado a cancelar este agendamento.'); // ✅ Usa o erro 403
    }

    return prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: 'CANCELADO' },
    });
  }

  public async listarTodos(): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({
      include: { cliente: true, servico: true },
      orderBy: { data: 'desc' },
    });
  }

  public async atualizarStatus(agendamentoId: string, status: string): Promise<Agendamento> {
    return prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status },
    });
  }
}