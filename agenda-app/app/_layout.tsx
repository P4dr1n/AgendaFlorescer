import { Stack } from 'expo-router';
import React from 'react';
import { AgendamentosProvider } from "../contexts/AgendamentosContexts";
import { UserProvider } from "../contexts/UserContext"

export default function RootLayout() {
  return (
    <UserProvider>
    <AgendamentosProvider>
    <Stack screenOptions={{animation: 'slide_from_right' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="modal"  options={{ headerShown: false }}/>
      {/* Atualizado de (tabs) para (telasCliente) */}
      <Stack.Screen name="(telasCliente)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
    </Stack>
    </AgendamentosProvider>
    </UserProvider>
  );
}