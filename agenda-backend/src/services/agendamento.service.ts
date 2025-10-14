// src/services/agendamento.service.ts

import { PrismaClient, Agendamento } from '@prisma/client';

const prisma = new PrismaClient();

// Interface para definir a "forma" dos dados que a função 'criar' espera receber.
// É uma boa prática para clarificar as entradas das suas funções.
interface CriarAgendamentoDTO {
  clienteId: string;
  servicoId: string;
  data: string; // A data virá como uma string no formato ISO (ex: "2025-12-10T10:00:00.000Z")
}

export class AgendamentoService {
  /**
   * Cria um novo agendamento para um cliente no banco de dados.
   * @param dados - Os dados necessários para criar o agendamento.
   * @returns O objeto do agendamento criado.
   */
  public async criar(dados: CriarAgendamentoDTO): Promise<Agendamento> {
    // Validação futura: aqui poderíamos adicionar lógicas para verificar
    // se o horário está disponível antes de criar o agendamento.

    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(dados.data), // Converte a string de data para o formato Date do JS
        status: 'PENDENTE', // Define um status inicial
        
        // Conecta o agendamento ao cliente e ao serviço existentes
        cliente: {
          connect: { id: dados.clienteId },
        },
        servico: {
          connect: { id: dados.servicoId },
        },
      },
      include: {
        servico: true, // Inclui os detalhes do serviço na resposta
      }
    });

    console.log('Novo agendamento criado:', agendamento);
    return agendamento;
  }

  /**
   * Lista todos os agendamentos de um cliente específico.
   * @param clienteId - O ID do cliente (obtido do token JWT).
   * @returns Uma lista dos agendamentos do cliente.
   */
  public async listarPorCliente(clienteId: string): Promise<Agendamento[]> {
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        clienteId: clienteId,
      },
      include: {
        // Inclui os detalhes do serviço em cada agendamento para mostrar ao cliente
        servico: true,
      },
      orderBy: {
        data: 'asc', // Ordena os agendamentos do mais próximo para o mais distante
      },
    });

    return agendamentos;
  }
}