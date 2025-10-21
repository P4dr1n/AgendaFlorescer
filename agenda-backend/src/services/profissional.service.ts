// src/services/profissional.service.ts

import { PrismaClient, Profissional } from '@prisma/client';

const prisma = new PrismaClient();

interface CriarProfissionalDTO {
  nome: string;
  especialidade?: string;
}

// Usamos Partial para indicar que todos os campos são opcionais na atualização
type AtualizarProfissionalDTO = Partial<CriarProfissionalDTO>;

export class ProfissionalService {
  public async criar(dados: CriarProfissionalDTO): Promise<Profissional> {
    const profissional = await prisma.profissional.create({
      data: dados,
    });
    return profissional;
  }

  public async listarTodos(): Promise<Profissional[]> {
    const profissionais = await prisma.profissional.findMany();
    return profissionais;
  }

  public async atualizar(id: string, dados: AtualizarProfissionalDTO): Promise<Profissional> {
    // O Prisma lançará um erro P2025 se o ID não for encontrado
    const profissional = await prisma.profissional.update({
      where: { id },
      data: dados,
    });
    return profissional;
  }

  public async deletar(id: string): Promise<void> {
    // O Prisma lançará um erro P2025 se o ID não for encontrado
    await prisma.profissional.delete({
      where: { id },
    });
    // Nota: O Prisma também pode lançar um erro P2014 se houver agendamentos
    // associados a este profissional, impedindo a deleção.
    // Poderíamos tratar isso especificamente se necessário.
  }
}