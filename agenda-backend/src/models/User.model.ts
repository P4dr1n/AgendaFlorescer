// src/models/User.model.ts

// Documentação do Modelo:
// Esta interface define a estrutura de dados para um utilizador.
// Usaremos esta "forma" em todo o nosso código para garantir consistência.
export interface User {
  id: string;
  nomeCompleto: string;
  email: string;
  senhaHash: string; // Importante: nunca guardamos a senha real, apenas o hash.
  telefone?: string; // O '?' torna o campo opcional.
}