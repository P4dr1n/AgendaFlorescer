// src/services/agendamento.service.ts

import { PrismaClient, Agendamento, DiaDaSemana, Servico, User, Profissional } from '@prisma/client';

const prisma = new PrismaClient();

interface CriarAgendamentoDTO {
  clienteId: string;
  servicoId: string;
  profissionalId: string;
  data: string; // Espera-se formato ISO UTC: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

const jsDayToEnumMap: Record<number, DiaDaSemana> = {
    0: DiaDaSemana.DOMINGO, 1: DiaDaSemana.SEGUNDA, 2: DiaDaSemana.TERCA,
    3: DiaDaSemana.QUARTA, 4: DiaDaSemana.QUINTA, 5: DiaDaSemana.SEXTA,
    6: DiaDaSemana.SABADO,
};

export class AgendamentoService {

  public async criar(dados: CriarAgendamentoDTO): Promise<Agendamento & { servico: Servico, profissional: Profissional }> {
    const servico = await prisma.servico.findUnique({ where: { id: dados.servicoId } });
    const profissional = await prisma.profissional.findUnique({ where: { id: dados.profissionalId } });

    if (!servico) throw new Error('Serviço não encontrado.');
    if (!profissional) throw new Error('Profissional não encontrado.');

    // --- Validação e Cálculo de Datas ---
    // Usar UTC para evitar problemas com fuso horário local do servidor
    const dataInicio = new Date(dados.data);
    if (isNaN(dataInicio.getTime())) throw new Error('Formato de data inválido. Use o formato ISO UTC (AAAA-MM-DDTHH:mm:ss.sssZ).');

    // Compara com a data/hora atual para evitar agendamentos no passado
    const agora = new Date();
    if (dataInicio < agora) throw new Error('Não é possível agendar um horário no passado.');

    const dataFim = new Date(dataInicio.getTime() + servico.duracao * 60000);

    // --- Verificação do Horário de Funcionamento ---
    const diaDaSemanaJS = dataInicio.getUTCDay(); // Usa getUTCDay() para consistência com UTC
    const diaDaSemanaEnum = jsDayToEnumMap[diaDaSemanaJS];
    const horarioDoDia = await prisma.horarioFuncionamento.findUnique({ where: { diaSemana: diaDaSemanaEnum } });

    if (!horarioDoDia || !horarioDoDia.aberto) {
      throw new Error(`A clínica não funciona às ${diaDaSemanaEnum.toLowerCase()}s.`);
    }

    // Convertendo HH:MM para minutos UTC desde a meia-noite
    const horaInicioAgendamento = dataInicio.getUTCHours() * 60 + dataInicio.getUTCMinutes();
    // Para dataFim, precisamos ter cuidado se o serviço atravessa a meia-noite (improvável mas possível)
    // Se dataFim for no dia seguinte UTC, consideramos como o fim do dia
    let horaFimAgendamento = dataFim.getUTCHours() * 60 + dataFim.getUTCMinutes();
    if (dataFim.getUTCDate() !== dataInicio.getUTCDate()) {
        horaFimAgendamento = 24*60; // Fim do dia
    }


    const [aberturaH, aberturaM] = horarioDoDia.abertura.split(':').map(Number);
    const [fechoH, fechoM] = horarioDoDia.fecho.split(':').map(Number);
    const minutoAbertura = aberturaH * 60 + aberturaM;
    const minutoFecho = fechoH * 60 + fechoM;

     // Ajuste: A hora FIM pode ser igual à hora de fecho
    if (horaInicioAgendamento < minutoAbertura || horaInicioAgendamento >= minutoFecho || horaFimAgendamento > minutoFecho) {
         // Verifica se o início é antes de abrir OU se o início já é na hora de fechar ou depois OU se o FIM ultrapassa a hora de fechar
        throw new Error(`Horário fora do expediente (${horarioDoDia.abertura} - ${horarioDoDia.fecho}) para este dia.`);
    }


    // --- Verificação de Conflito de Horário (Local Único) ---
    // Busca agendamentos (não cancelados) que *possam* conflitar no mesmo dia UTC
     const inicioDiaUTC = new Date(Date.UTC(dataInicio.getUTCFullYear(), dataInicio.getUTCMonth(), dataInicio.getUTCDate()));
     const fimDiaUTC = new Date(Date.UTC(dataInicio.getUTCFullYear(), dataInicio.getUTCMonth(), dataInicio.getUTCDate() + 1));

    const agendamentosPotenciaisDoDia = await prisma.agendamento.findMany({
      where: {
        status: { not: 'CANCELADO' },
        data: {
          gte: inicioDiaUTC, // Começa no início do dia UTC
          lt: fimDiaUTC,    // Termina antes do início do próximo dia UTC
        },
      },
      include: { servico: true }, // Precisamos da duração do serviço existente
    });

    // ✅ LÓGICA DE CONFLITO CORRIGIDA E MAIS PRECISA
    const conflitoReal = agendamentosPotenciaisDoDia.find(agExistente => {
      const agExistenteInicio = agExistente.data;
      const agExistenteFim = new Date(agExistenteInicio.getTime() + agExistente.servico.duracao * 60000);

      // Verifica sobreposição:
      // O novo agendamento começa ANTES do existente terminar?
      const novoComecaAntes = dataInicio < agExistenteFim;
      // O novo agendamento termina DEPOIS do existente começar?
      const novoTerminaDepois = dataFim > agExistenteInicio;

      // Se ambas as condições forem verdadeiras, há sobreposição
      return novoComecaAntes && novoTerminaDepois;
    });


    if (conflitoReal) {
      // Mensagem mais informativa para depuração
      console.warn(`Conflito detetado: Novo [${dataInicio.toISOString()}-${dataFim.toISOString()}] vs Existente [${conflitoReal.data.toISOString()}-${new Date(conflitoReal.data.getTime() + conflitoReal.servico.duracao * 60000).toISOString()}]`);
      throw new Error('O horário solicitado já está ocupado por outro agendamento.');
    }

    // --- Criação do Agendamento ---
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: dataInicio, // Usa a data original validada
        status: 'PENDENTE',
        cliente: { connect: { id: dados.clienteId } },
        servico: { connect: { id: dados.servicoId } },
        profissional: { connect: { id: dados.profissionalId } },
      },
      include: { servico: true, profissional: true },
    });

    console.log('Novo agendamento criado:', novoAgendamento);
    return novoAgendamento;
  }

  // Métodos listarPorCliente, cancelar, listarTodos, atualizarStatus (sem alterações lógicas, apenas formatação e tipos atualizados)
  public async listarPorCliente(clienteId: string): 
  Promise<(Agendamento & { servico: Servico, profissional: Profissional })[]
  > { return prisma.agendamento.findMany({ where: { clienteId: clienteId }, 
  include: { servico: true, profissional: true }, orderBy: { data: 'asc' } }); }
  public async cancelar(agendamentoId: string, clienteId: string): Promise<Agendamento & { servico: Servico, profissional: Profissional }> { const ag = await prisma.agendamento.findUnique({where: {id: agendamentoId}}); if (!ag) throw new Error('Agendamento não encontrado.'); if (ag.clienteId !== clienteId) throw new Error('Não autorizado a cancelar este agendamento.'); return prisma.agendamento.update({ where: { id: agendamentoId }, data: { status: 'CANCELADO' }, include: { servico: true, profissional: true } }); }
  public async listarTodos(): Promise<(Agendamento & { servico: Servico, profissional: Profissional, cliente: Pick<User, 'id' | 'usuario' | 'email'> })[]> { return prisma.agendamento.findMany({ include: { cliente: { select: { id: true, usuario: true, email: true } }, servico: true, profissional: true }, orderBy: { data: 'desc' } }); }
  public async atualizarStatus(agendamentoId: string, status: string): Promise<Agendamento & { servico: Servico, profissional: Profissional, cliente: Pick<User, 'id' | 'usuario'> }> { const statusValidos = ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']; const statusUpper = status.toUpperCase(); if (!statusValidos.includes(statusUpper)) throw new Error(`Status inválido.`); return prisma.agendamento.update({ where: { id: agendamentoId }, data: { status: statusUpper }, include: { servico: true, profissional: true, cliente: { select: { id: true, usuario: true }} } }); }
  public async listarHorariosDisponiveis(dataConsulta: string, servicoId: string): Promise<string[]> { const data = new Date(`${dataConsulta}T00:00:00.000Z`); if (isNaN(data.getTime())) throw new Error('Formato de data inválido. Use AAAA-MM-DD.'); const servico = await prisma.servico.findUnique({ where: { id: servicoId } }); if (!servico) throw new Error('Serviço não encontrado.'); const diaDaSemanaJS = data.getUTCDay(); const diaDaSemanaEnum = jsDayToEnumMap[diaDaSemanaJS]; const horarioDoDia = await prisma.horarioFuncionamento.findUnique({ where: { diaSemana: diaDaSemanaEnum } }); if (!horarioDoDia || !horarioDoDia.aberto) return []; const inicioDiaUTC = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate())); const fimDiaUTC = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate() + 1)); const agendamentosDoDia = await prisma.agendamento.findMany({ where: { status: { not: 'CANCELADO' }, data: { gte: inicioDiaUTC, lt: fimDiaUTC } }, include: { servico: true } }); const [aberturaH, aberturaM] = horarioDoDia.abertura.split(':').map(Number); const [fechoH, fechoM] = horarioDoDia.fecho.split(':').map(Number); const minutoAbertura = aberturaH * 60 + aberturaM; const minutoFecho = fechoH * 60 + fechoM; const duracaoServico = servico.duracao; const horariosDisponiveis: string[] = []; const intervaloMinutos = 15; const agora = new Date(); for (let minutoAtual = minutoAbertura; minutoAtual < minutoFecho; minutoAtual += intervaloMinutos) { const horaInicioPotencial = new Date(inicioDiaUTC); horaInicioPotencial.setUTCMinutes(minutoAtual); const horaFimPotencial = new Date(horaInicioPotencial.getTime() + duracaoServico * 60000); const minutoFimPotencial = horaFimPotencial.getUTCHours() * 60 + horaFimPotencial.getUTCMinutes(); if (minutoFimPotencial > minutoFecho || horaFimPotencial.getUTCDate() !== inicioDiaUTC.getUTCDate()) continue; if (inicioDiaUTC.toDateString() === agora.toDateString() && horaInicioPotencial < agora) continue; const temConflito = agendamentosDoDia.some(ag => { const agInicio = ag.data; const agFim = new Date(agInicio.getTime() + ag.servico.duracao * 60000); return horaInicioPotencial < agFim && horaFimPotencial > agInicio; }); if (!temConflito) { const horaStr = horaInicioPotencial.getUTCHours().toString().padStart(2, '0'); const minutoStr = horaInicioPotencial.getUTCMinutes().toString().padStart(2, '0'); horariosDisponiveis.push(`${horaStr}:${minutoStr}`); } } return horariosDisponiveis; }
}