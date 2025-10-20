// app/login.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native"; // Alert importado aqui
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import api from '../services/api'; // Importa a nossa instância do Axios configurada

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!usuario || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha o utilizador e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      // Faz a chamada POST para a API de login
      const response = await api.post('/auth/login', {
        usuario,
        senha,
      });

      const { token } = response.data;

      // Guarda o token de forma segura
      await SecureStore.setItemAsync('userToken', token);

      // Navega para a tela principal (replace remove a tela de login do histórico)
      router.replace("/(telasCliente)/home");

    } catch (error: any) {
      // Mostra um alerta em caso de erro da API ou de rede
      const errorMessage = error.response?.data?.message || 'Não foi possível fazer login. Verifique suas credenciais ou a conexão com o servidor.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setIsLoading(false); // Finaliza o loading, independentemente do resultado
    }
  };

  const handleNavigateToRegister = () => {
    // Só navega se não estiver em processo de login
    if (!isLoading) {
      router.push("/register");
    }
  };

  return (
    <LinearGradient colors={["#B23A6D", "#E85A8E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.content} >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-clock" 
            size={48} color="#FFF" />
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
            autoCapitalize="none" 
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
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin} activeOpacity={0.9} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#B23A6D" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
            </TouchableOpacity>
            <TouchableOpacity
             style={[styles.button, styles.secondaryButton]}
              onPress={handleNavigateToRegister}
               activeOpacity={0.9}
                disabled={isLoading}>
              <Text style={styles.secondaryButtonText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
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
