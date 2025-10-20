// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000, // Adiciona um timeout de 10 segundos
});

// Interceptor: Executa antes de cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Enviando requisição:', config.method?.toUpperCase(), config.url); // Log da requisição
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (para debugging)
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response.status, response.config.url); // Log da resposta
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error.response?.status, error.response?.data); // Log detalhado do erro
    return Promise.reject(error);
  }
);

export default api;