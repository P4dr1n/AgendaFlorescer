import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'agendaFlorescer.authToken';

const isWeb = Platform.OS === 'web';

export async function saveAuthToken(token: string): Promise<void> {
  if (isWeb) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    return;
  }

  if (typeof SecureStore.setItemAsync === 'function') {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return;
  }

  throw new Error('SecureStore não está disponível neste dispositivo.');
}

export async function getAuthToken(): Promise<string | null> {
  if (isWeb) {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
  }

  if (typeof SecureStore.getItemAsync === 'function') {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }

  return null;
}

export async function clearAuthToken(): Promise<void> {
  if (isWeb) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }

  if (typeof SecureStore.deleteItemAsync === 'function') {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
