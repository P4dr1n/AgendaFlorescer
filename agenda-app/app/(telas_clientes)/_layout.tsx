import React from 'react';
import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="novo-agendamento" options={{ headerShown: false }} />
    </Stack>
  );
}