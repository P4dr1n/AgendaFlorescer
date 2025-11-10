import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipo de um agendamento (com id obrigatório)
export type Agendamento = {
  id: string;
  servico: string;
  profissional: string;
  data: string;
  hora: string;
};

// Tipo do contexto – adicionarAgendamento aceita dados sem id, que será gerado internamente
type AgendamentosContextType = {
  agendamentos: Agendamento[];
  adicionarAgendamento: (novo: Omit<Agendamento, "id">) => void;
  removerAgendamento: (id: string) => void;
};

const AgendamentosContext = createContext<AgendamentosContextType | undefined>(undefined);

export function AgendamentosProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  function adicionarAgendamento(novo: Omit<Agendamento, "id">) {
    const novoComId: Agendamento = { ...novo, id: Date.now().toString() };
    setAgendamentos((antigos) => [...antigos, novoComId]);
  }

  function removerAgendamento(id: string) {
    setAgendamentos((antigos) => antigos.filter(agendamento => agendamento.id !== id));
  }

  return (
    <AgendamentosContext.Provider
      value={{ agendamentos, adicionarAgendamento, removerAgendamento }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  const context = useContext(AgendamentosContext);
  if (!context) {
    throw new Error("useAgendamentos deve ser usado dentro de um AgendamentosProvider");
  }
  return context;
}
