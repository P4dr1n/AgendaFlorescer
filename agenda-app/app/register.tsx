// agenda-app/app/register.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";

export default function RegisterScreen() {
  const router = useRouter();
  
  // Estados do formulário
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleRegister = async () => {
    // 1. Validações básicas
    if (!usuario.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("⚠️ Atenção", "Preencha os campos obrigatórios (Usuário, Email e Senha).");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("⚠️ Atenção", "As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("⚠️ Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("📝 Tentando registrar usuário:", { usuario, email });

      // 2. Chamada à API
      const response = await api.post("/api/auth/register", {
        usuario: usuario.trim(),
        email: email.trim(),
        senha: senha,
        telefone: telefone.trim() || undefined, // Envia undefined se estiver vazio
        role: "CLIENTE", // Força o papel de cliente
      });

      console.log("✅ Registro realizado com sucesso:", response.data);

      // 3. Sucesso
      Alert.alert(
        "Sucesso! 🎉",
        "Sua conta foi criada. Faça login para continuar.",
        [
          {
            text: "Ir para Login",
            onPress: () => router.back(), // Volta para a tela de login
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ Erro no registro:", error);

      let errorMessage = "Não foi possível criar a conta.";

      if (error.response) {
        // Erro retornado pelo backend (ex: usuário já existe)
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Erro de conexão
        errorMessage = "Erro de conexão. Verifique sua internet e se o servidor está rodando.";
      }

      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#B23A6D", "#E85A8E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Criar Conta</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account-plus" size={40} color="#FFF" />
              </View>

              {/* Usuário */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Usuário *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Escolha um nome de usuário"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={usuario}
                  onChangeText={setUsuario}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              {/* Telefone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(XX) XXXXX-XXXX"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={telefone}
                  onChangeText={setTelefone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>

              {/* Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={setSenha}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                  >
                    <MaterialCommunityIcons
                      name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="rgba(255, 255, 255, 0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Senha *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Digite a senha novamente"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!mostrarSenha}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleRegister}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#B23A6D" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Cadastrar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 32,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#FFF",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#FFF",
  },
  eyeButton: {
    padding: 14,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#B23A6D",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
