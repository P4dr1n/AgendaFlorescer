"use client"

import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useUser } from "../../contexts/UserContext"

export default function ConfiguracoesScreen() {
  const router = useRouter()
  const { user, atualizarUsuario } = useUser()

  // Estados locais para edição dos dados
  const [nome, setNome] = useState(user.nome)
  const [email, setEmail] = useState(user.email)
  const [telefone, setTelefone] = useState(user.telefone)
  const [senhaAtual, setSenhaAtual] = useState("")
  const [senhaNova, setSenhaNova] = useState("")

  // Função para formatar o telefone: limita a 11 dígitos e aplica máscara (XX) XXXXX-XXXX
  const formatPhone = (text: string) => {
    // Remove tudo que não é dígito
    const cleaned = text.replace(/\D/g, "")
    // Limita a 11 dígitos
    const limited = cleaned.slice(0, 11)
    // Aplica a máscara
    if (limited.length <= 2) {
      return limited
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
    }
  }

  // Salvar alterações gerais do perfil
  const salvarAlteracoes = () => {
    if (senhaAtual && senhaAtual !== user.senha) {
      Alert.alert("Erro", "Senha atual incorreta.")
      return
    }

    atualizarUsuario({
      nome,
      email,
      telefone,
      ...(senhaNova ? { senha: senhaNova } : {}),
    })

    // Redirecionamento automático ao perfil após salvar
    router.back()
    setSenhaAtual("")
    setSenhaNova("")
  }

  // Alterar senha com verificação
  const handleMudarSenha = () => {
    if (!senhaAtual || !senhaNova) {
      Alert.alert("Erro", "Digite sua senha atual e a nova senha para continuar.")
      return
    }
    if (senhaAtual === senhaNova) {
      Alert.alert("Aviso", "A nova senha não pode ser igual à atual.")
      return
    }
    if (senhaAtual !== user.senha) {
      Alert.alert("Erro", "Senha atual incorreta.")
      return
    }

    atualizarUsuario({ senha: senhaNova })
    // Redirecionamento automático ao perfil após alterar senha
    router.back()
    setSenhaAtual("")
    setSenhaNova("")
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF4081" />
          </TouchableOpacity>
        </View>

        {/* Dados de Perfil */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Editar Perfil</Text>

          <InputField label="Nome" icon="account-outline" value={nome} onChangeText={setNome} />
          <InputField label="E-mail" icon="email-outline" value={email} onChangeText={setEmail} />
          <InputField
            label="Telefone"
            icon="phone-outline"
            value={telefone}
            onChangeText={(text) => setTelefone(formatPhone(text))}
            keyboardType="numeric"
            maxLength={15} // Permite até a máscara completa
          />

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={salvarAlteracoes}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFF" />
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        {/* Alterar Senha */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>

          <InputField
            label="Senha Atual"
            icon="lock-outline"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
          />
          <InputField
            label="Nova Senha"
            icon="lock-reset"
            value={senhaNova}
            onChangeText={setSenhaNova}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, styles.passwordButton]}
            onPress={handleMudarSenha}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="lock-check" size={20} color="#FFF" />
            <Text style={styles.passwordButtonText}>Atualizar Senha</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function InputField({
  label,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength,
}: {
  label: string
  icon: any
  value: string
  onChangeText: (text: string) => void
  secureTextEntry?: boolean
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"
  maxLength?: number
}) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelRow}>
        <MaterialCommunityIcons name={icon} size={18} color="#951950" />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Digite seu ${label.toLowerCase()}`}
        placeholderTextColor="#b58da3"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
  content: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 24, gap: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#951950", fontSize: 28, fontWeight: "800" },
  iconButton: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    gap: 20,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: { color: "#951950", fontSize: 20, fontWeight: "700", marginBottom: -4 },
  inputGroup: { gap: 8 },
  inputLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  inputLabel: {
    color: "#951950",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#ffe4ff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#2D2D2D",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
  },
  saveButton: {
    backgroundColor: "#FF4081",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  passwordButton: {
    backgroundColor: "#951950",
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  passwordButtonText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
})