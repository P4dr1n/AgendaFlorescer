// src/services/servico.service.ts

import { PrismaClient, Servico } from '@prisma/client';

const prisma = new PrismaClient();

interface CriarServicoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
}

interface AtualizarServicoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  duracao?: number;
}

export class ServicoService {
  public async criar(dados: CriarServicoDTO): Promise<Servico> {
    const servico = await prisma.servico.create({
      data: dados,
    });
    return servico;
  }

  public async listarTodos(): Promise<Servico[]> {
    const servicos = await prisma.servico.findMany();
    return servicos;
  }

  public async atualizar(id: string, dados: AtualizarServicoDTO): Promise<Servico> {
    const servico = await prisma.servico.update({
      where: { id },
      data: dados,
    });
    return servico;
  }

  public async deletar(id: string): Promise<void> {
    // O Prisma lançará um erro por padrão se o 'id' não for encontrado,
    // que será capturado pelo nosso controller.
    await prisma.servico.delete({
      where: { id },
    });
  }
}