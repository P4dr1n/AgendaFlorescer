import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

export default function RemarcarScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Text>Remarcar</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
