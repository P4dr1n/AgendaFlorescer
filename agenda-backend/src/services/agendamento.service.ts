// src/services/agendamento.service.ts

import { PrismaClient, Agendamento } from '@prisma/client';

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
      throw new Error('Serviço não encontrado.');
    }

    const dataInicio = new Date(dados.data);
    const dataFim = new Date(dataInicio.getTime() + servico.duracao * 60000);

    const agendamentosConflitantes = await prisma.agendamento.findMany({
      where: {
        AND: [
          {
            data: {
              gte: new Date(dataInicio.setHours(0, 0, 0, 0)),
              lt: new Date(dataInicio.setHours(23, 59, 59, 999)),
            },
          },
        ],
      },
      include: {
        servico: true,
      },
    });
    
    const conflito = agendamentosConflitantes.find(ag => {
        const agInicio = ag.data;
        const agFim = new Date(agInicio.getTime() + ag.servico.duracao * 60000);
        return dataInicio < agFim && dataFim > agInicio;
    });

    if (conflito) {
      throw new Error('O horário solicitado já está ocupado.');
    }

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: dataInicio,
        status: 'PENDENTE',
        cliente: {
          connect: { id: dados.clienteId },
        },
        servico: {
          connect: { id: dados.servicoId },
        },
      },
      include: {
        servico: true,
      },
    });

    console.log('Novo agendamento criado:', novoAgendamento);
    return novoAgendamento;
  }

  public async listarPorCliente(clienteId: string): Promise<Agendamento[]> {
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        clienteId: clienteId,
      },
      include: {
        servico: true,
      },
      orderBy: {
        data: 'asc',
      },
    });
    return agendamentos;
  }

  public async cancelar(agendamentoId: string, clienteId: string): Promise<Agendamento> {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado.');
    }

    if (agendamento.clienteId !== clienteId) {
      throw new Error('Não autorizado a cancelar este agendamento.');
    }

    const agendamentoCancelado = await prisma.agendamento.update({
      where: {
        id: agendamentoId,
      },
      data: {
        status: 'CANCELADO',
      },
    });
    return agendamentoCancelado;
  }

  /**
   * ✅ NOVO MÉTODO (ADMIN): Lista todos os agendamentos do sistema.
   */
  public async listarTodos(): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({
      include: {
        cliente: true, // Inclui os dados do cliente
        servico: true, // Inclui os dados do serviço
      },
      orderBy: {
        data: 'desc', // Mostra os mais recentes primeiro
      },
    });
  }

  /**
   * ✅ NOVO MÉTODO (ADMIN): Atualiza o status de qualquer agendamento.
   */
  public async atualizarStatus(agendamentoId: string, status: string): Promise<Agendamento> {
    return prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status },
    });
  }
}