// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface User {
  id: string;
  usuario: string;
  email: string;
  telefone?: string;
  role: 'CLIENTE' | 'ADMIN';
}

interface UserContextData {
  user: User | null;
  loading: boolean;
  loadUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Verificar autenticação apenas uma vez ao iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (token) {
        console.log('🔐 Token encontrado, carregando usuário...');
        await loadUser();
      } else {
        console.log('⚠️ Sem token, usuário não autenticado');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async (): Promise<User | null> => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.log('⚠️ Sem token para carregar usuário');
        setUser(null);
        return null;
      }

      console.log('📤 Buscando dados do usuário...');
      const response = await api.get('/api/auth/me');
      
      console.log('✅ Usuário carregado:', response.data);
      setUser(response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao carregar usuário:', error.message);
      
      // Se der erro 401 (não autorizado), limpar token
      if (error.response?.status === 401) {
        console.log('🔓 Token inválido, fazendo logout...');
        await logout();
      }
      
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
      console.log('🔓 Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, loadUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  
  return context;
}
