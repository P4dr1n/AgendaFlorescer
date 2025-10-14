// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';

// Simulação de um "banco de dados" em memória.
// No futuro, isto será substituído por um banco de dados real (ex: PostgreSQL, MongoDB).
const users: User[] = [];

export class AuthService {
  /**
   * Valida as credenciais de um utilizador.
   */
  public async login(usuario: string, senha: string): Promise<string> {
    console.log(`Validando credenciais para: ${usuario}`);

    const user = users.find(u => u.usuario === usuario);

    // Verifica se o utilizador existe e se a senha corresponde ao hash guardado
    if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
      throw new Error('Usuário ou senha inválidos.');
    }

    const token = 'token_jwt_super_secreto_gerado_com_sucesso';
    return token;
  }

  /**
   * Regista um novo utilizador no sistema.
   * @param data - Os dados do novo utilizador.
   * @returns O novo utilizador criado (sem a senha).
   * @throws Lança um erro se o utilizador ou email já existirem.
   */
  public async register(data: Omit<User, 'id' | 'senhaHash'> & { senha: string }): Promise<User> {
    // Verifica se o utilizador ou email já existem
    if (users.some(u => u.usuario === data.usuario)) {
      throw new Error('Este nome de usuário já está em uso.');
    }
    if (users.some(u => u.email === data.email)) {
      throw new Error('Este email já está em uso.');
    }

    // Gera o hash da senha - nunca guarde a senha original!
    // O número 10 é o "custo" do hashing, um bom padrão de segurança.
    const senhaHash = await bcrypt.hash(data.senha, 10);

    const novoUsuario: User = {
      id: `user_${Date.now()}`, // ID simples para simulação
      usuario: data.usuario,
      email: data.email,
      senhaHash: senhaHash, // Guarda apenas o hash
      telefone: data.telefone,
    };

    users.push(novoUsuario);
    console.log('Novo usuário registrado:', novoUsuario);

    return novoUsuario;
  }
}