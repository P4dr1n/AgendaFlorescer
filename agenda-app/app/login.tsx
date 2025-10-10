import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    router.replace("/(tabs)/home")
  }

  const handleNavigateToRegister = () => {
    router.push("/register")
  }

  return (
      <LinearGradient colors={["#B23A6D", "#E85A8E"]} style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={48} color="#FFF" />
          </View>

          <Text style={styles.title}>Agendamento</Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleNavigateToRegister}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryButtonText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
      </LinearGradient>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    color: "#FFF",
    fontWeight: "300",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 56,
    fontWeight: "400",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#FFF",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
    gap: 14,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FFF",
  },
  primaryButtonText: {
    color: "#B23A6D",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  secondaryButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
})
