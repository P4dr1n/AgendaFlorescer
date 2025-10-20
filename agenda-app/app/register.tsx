// app/register.tsx

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native"; // Alert importado aqui
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api"; // Importa o nosso serviço de API configurado

export default function RegisterScreen() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoBack = () => {
    // Só volta se não estiver em processo de registo
    if (!isLoading && router.canGoBack()) {
      router.back();
    }
  };

  const handleRegister = async () => {
    if (!usuario || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        usuario,
        email,
        senha,
        
        telefone: telefone || undefined,
      });

      // Mostra mensagem de sucesso e redireciona para o login
      Alert.alert("Sucesso!", "A sua conta foi criada. Por favor, faça o login.", [
        { text: "OK", onPress: () => router.push('/login') } // Usa push para permitir voltar
      ]);

    } catch (error: any) {
      // Mostra a mensagem de erro vinda da API (ex: "Email já em uso")
      const errorMessage = error.response?.data?.message || "Não foi possível criar a conta. Tente novamente.";
      Alert.alert("Erro no Registo", errorMessage);
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  return (
    <LinearGradient colors={["#B23A6D", "#E85A8E"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        {/* Adicionado accessibilityRole para semântica web */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color="rgba(255, 255, 255, 0.7)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none" 
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
               name="email-outline"
               size={20}
               color="rgba(255, 255, 255, 0.7)"
               style={styles.inputIcon} 
             />
              <TextInput 
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)" 
                keyboardType="email-address"
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons 
               name="phone-outline" 
               size={20} 
               color="rgba(255, 255, 255, 0.7)" 
               style={styles.inputIcon} 
              />
              <TextInput style={styles.input} 
               placeholder="Telefone (Opcional)" 
               placeholderTextColor="rgba(255, 255, 255, 0.5)" 
               keyboardType="phone-pad" 
               value={telefone} 
               onChangeText={setTelefone} 
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons 
               name="lock-outline" 
               size={20} 
               color="rgba(255, 255, 255, 0.7)" 
               style={styles.inputIcon} 
              />
              <TextInput 
               style={styles.input} 
               placeholder="Senha" 
               placeholderTextColor="rgba(255, 255, 255, 0.5)"
               secureTextEntry value={senha} 
               onChangeText={setSenha} 
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color="rgba(255, 255, 255, 0.7)" 
                style={styles.inputIcon} 
               />
               <TextInput style={styles.input} 
                 placeholder="Confirmar Senha" 
                 placeholderTextColor="rgba(255, 255, 255, 0.5)" 
                 secureTextEntry value={confirmarSenha} 
                 onChangeText={setConfirmarSenha} 
                />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#B23A6D" /> : <Text style={styles.primaryButtonText}>Registar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack} disabled={isLoading}>
              <Text style={styles.secondaryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 48,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  form: {
    width: "100%",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#B23A6D",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
})
