// src/services/promocao.service.ts

import { PrismaClient, Promocao } from '@prisma/client';

const prisma = new PrismaClient();

// Interface para garantir a tipagem na criação (similar ao modelo Prisma)
interface CriarPromocaoDTO {
  titulo: string;
  descricao: string;
  descontoPercentual: number;
  dataInicio: string | Date; // Aceita string ISO ou Date
  dataFim: string | Date;    // Aceita string ISO ou Date
}

// Partial torna todos os campos opcionais para atualização
type AtualizarPromocaoDTO = Partial<CriarPromocaoDTO>;

export class PromocaoService {
  public async criar(dados: CriarPromocaoDTO): Promise<Promocao> {
    const promocao = await prisma.promocao.create({
      data: {
        ...dados,
        // Converte as datas para o formato Date se vierem como string
        dataInicio: new Date(dados.dataInicio),
        dataFim: new Date(dados.dataFim),
      },
    });
    return promocao;
  }

  public async listarTodas(): Promise<Promocao[]> {
    const promocoes = await prisma.promocao.findMany({
        // Pode adicionar filtros aqui, ex: listar apenas promoções ativas
        // where: {
        //     dataInicio: { lte: new Date() },
        //     dataFim: { gte: new Date() },
        // }
        orderBy: {
            dataInicio: 'desc', // Mostra as mais recentes primeiro
        }
    });
    return promocoes;
  }

  public async atualizar(id: string, dados: AtualizarPromocaoDTO): Promise<Promocao> {
    const promocao = await prisma.promocao.update({
      where: { id },
      data: {
        ...dados,
        // Garante a conversão de datas se elas forem atualizadas
        ...(dados.dataInicio && { dataInicio: new Date(dados.dataInicio) }),
        ...(dados.dataFim && { dataFim: new Date(dados.dataFim) }),
      },
    });
    return promocao;
  }

  public async deletar(id: string): Promise<void> {
    await prisma.promocao.delete({
      where: { id },
    });
  }
}