import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{animation: 'slide_from_right' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      {/* Atualizado de (tabs) para (telasCliente) */}
      <Stack.Screen name="(telasCliente)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
    </Stack>
  );
}