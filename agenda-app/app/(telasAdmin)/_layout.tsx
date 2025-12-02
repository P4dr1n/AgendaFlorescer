// agenda-app/app/(telasAdmin)/_layout.tsx

import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="agendamentos" />
      <Stack.Screen name="servicos" />
      <Stack.Screen name="perfil" />
    </Stack>
  );
}
