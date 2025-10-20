"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuthToken } from "@/lib/auth-storage";
import {
  createAgendamentoRequest,
  listServicosRequest,
} from "@/lib/api";
import type { ServicoResponse } from "@/lib/api";

interface NewAppointmentFormProps {
  loadingServicos: boolean
  servicos: ServicoResponse[]
  selectedServicoId: string
  onSelectServico: (id: string) => void
  dataInput: string
  onChangeData: (data: string) => void
  horaInput: string
  onChangeHora: (hora: string) => void
  formError: string | null
  creatingAgendamento: boolean
  onSubmit: () => Promise<void>
  onCancel: () => void
}

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FCE4EC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTextGroup: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8c3155",
  },
  subtitle: {
    fontSize: 14,
    color: "#8c3155",
    opacity: 0.8,
    lineHeight: 20,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
})

export default function NovoAgendamentoScreen() {
  const router = useRouter()

  const [authToken, setAuthToken] = useState<string | null>(null)
  const [servicos, setServicos] = useState<ServicoResponse[]>([])
  const [selectedServicoId, setSelectedServicoId] = useState("")
  const [dataInput, setDataInput] = useState("")
  const [horaInput, setHoraInput] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [creatingAgendamento, setCreatingAgendamento] = useState(false)
  const [loadingServicos, setLoadingServicos] = useState(true)

  useEffect(() => {
    let active = true

    const carregarContexto = async () => {
      try {
        const token = await getAuthToken()

        if (!active) {
          return
        }

        if (!token) {
          setFormError("Não foi possível identificar o usuário. Faça login novamente.")
          setLoadingServicos(false)
          return
        }

        setAuthToken(token)

        const lista = await listServicosRequest()

        if (!active) {
          return
        }

        setServicos(lista)
      } catch (error) {
        console.warn("Falha ao carregar serviços disponíveis", error)
        if (active) {
          setFormError("Não foi possível carregar os serviços disponíveis.")
        }
      } finally {
        if (active) {
          setLoadingServicos(false)
        }
      }
    }

    carregarContexto()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedServicoId && servicos.length > 0) {
      setSelectedServicoId(servicos[0].id)
    }
  }, [servicos, selectedServicoId])

  const goBackToHome = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace("/(telas_clientes)/home")
    }
  }, [router])

  const resetForm = useCallback(() => {
    setSelectedServicoId(servicos[0]?.id ?? "")
    setDataInput("")
    setHoraInput("")
    setFormError(null)
  }, [servicos])

  const handleCancel = useCallback(() => {
    goBackToHome()
  }, [goBackToHome])

  const handleSubmit = useCallback(async () => {
    if (!selectedServicoId) {
      setFormError("Selecione um serviço para continuar.")
      return
    }

    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dataInput.trim())) {
      setFormError("Informe a data no formato AAAA-MM-DD.")
      return
    }

    if (!/^[0-9]{2}:[0-9]{2}$/.test(horaInput.trim())) {
      setFormError("Informe a hora no formato HH:mm.")
      return
    }

    const token = authToken ?? (await getAuthToken())

    if (!token) {
      setFormError("Não foi possível identificar o usuário. Faça login novamente.")
      return
    }

    const dataISO = new Date(`${dataInput.trim()}T${horaInput.trim()}:00`)

    if (Number.isNaN(dataISO.getTime())) {
      setFormError("Data ou hora inválida. Revise os valores informados.")
      return
    }

    setCreatingAgendamento(true)
    setFormError(null)

    try {
      await createAgendamentoRequest(token, {
        servicoId: selectedServicoId,
        data: dataISO.toISOString(),
      })

      Alert.alert("Agendamento criado", "Seu horário foi reservado com sucesso.", [
        {
          text: "Agendar outro",
          onPress: resetForm,
        },
        {
          text: "Voltar para a home",
          onPress: goBackToHome,
        },
      ])
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o agendamento."
      setFormError(message)
    } finally {
      setCreatingAgendamento(false)
    }
  }, [
    authToken,
    dataInput,
    horaInput,
    resetForm,
    router,
    selectedServicoId,
  ])

  const subtitle = useMemo(() => {
    if (loadingServicos) {
      return "Buscando serviços disponíveis..."
    }

    if (servicos.length === 0) {
      return "Nenhum serviço cadastrado no momento."
    }

    return "Escolha um serviço e informe a data e horário desejados."
  }, [loadingServicos, servicos.length])

  return (
    <SafeAreaView style={screenStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={screenStyles.header}>
        <TouchableOpacity
          style={screenStyles.backButton}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#8c3155" />
        </TouchableOpacity>

        <View style={screenStyles.headerTextGroup}>
          <Text style={screenStyles.title}>Novo agendamento</Text>
          <Text style={screenStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={screenStyles.formWrapper}>
        <NewAppointmentForm
          loadingServicos={loadingServicos}
          servicos={servicos}
          selectedServicoId={selectedServicoId}
          onSelectServico={setSelectedServicoId}
          dataInput={dataInput}
          onChangeData={setDataInput}
          horaInput={horaInput}
          onChangeHora={setHoraInput}
          formError={formError}
          creatingAgendamento={creatingAgendamento}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  )
}

export function NewAppointmentForm({
  loadingServicos,
  servicos,
  selectedServicoId,
  onSelectServico,
  dataInput,
  onChangeData,
  horaInput,
  onChangeHora,
  formError,
  creatingAgendamento,
  onSubmit,
  onCancel,
}: NewAppointmentFormProps) {
  const selectedServico = useMemo(() => servicos.find((s) => s.id === selectedServicoId), [servicos, selectedServicoId])

  const handleSelectServico = useCallback(
    (servicoId: string) => {
      onSelectServico(servicoId)
    },
    [onSelectServico],
  )

  if (loadingServicos) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#951950" />
        <Text style={styles.loadingText}>Carregando serviços...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="briefcase-outline" size={20} color="#951950" />
          <Text style={styles.sectionTitle}>Selecione um serviço</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicosScroll}>
          {servicos.map((servico) => (
            <TouchableOpacity
              key={servico.id}
              style={[styles.servicoCard, selectedServicoId === servico.id && styles.servicoCardActive]}
              onPress={() => handleSelectServico(servico.id)}
              activeOpacity={0.7}
            >
              <View style={styles.servicoContent}>
                <Text
                  style={[styles.servicoName, selectedServicoId === servico.id && styles.servicoNameActive]}
                  numberOfLines={2}
                >
                  {servico.nome}
                </Text>
                {servico.duracao && (
                  <Text
                    style={[styles.servicoDuracao, selectedServicoId === servico.id && styles.servicoDuracaoActive]}
                  >
                    {servico.duracao} min
                  </Text>
                )}
              </View>
              {selectedServicoId === servico.id && (
                <View style={styles.checkmark}>
                  <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color="#951950" />
          <Text style={styles.sectionTitle}>Data e horário</Text>
        </View>

        <View style={styles.inputsGrid}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Data (AAAA-MM-DD)</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="calendar" size={18} color="#de638e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="2025-01-15"
                placeholderTextColor="#cba2ae"
                value={dataInput}
                onChangeText={onChangeData}
                editable={!creatingAgendamento}
                keyboardType="default"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Horário (HH:mm)</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#de638e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="14:30"
                placeholderTextColor="#cba2ae"
                value={horaInput}
                onChangeText={onChangeHora}
                editable={!creatingAgendamento}
                keyboardType="default"
              />
            </View>
          </View>
        </View>
      </View>

      {formError && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={18} color="#FFFFFF" />
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      )}

      {selectedServico && dataInput && horaInput && !formError && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Serviço:</Text>
            <Text style={styles.summaryValue}>{selectedServico.nome}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Data:</Text>
            <Text style={styles.summaryValue}>{dataInput}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Horário:</Text>
            <Text style={styles.summaryValue}>{horaInput}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={creatingAgendamento}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="close" size={20} color="#de638e" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, creatingAgendamento && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={creatingAgendamento}
          activeOpacity={0.7}
        >
          {creatingAgendamento ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Agendando...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Confirmar agendamento</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 24,
    paddingBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#951950",
    fontWeight: "500",
  },

  // Section Styles
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#951950",
    letterSpacing: -0.3,
  },

  // Service Selection Styles
  servicosScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  servicoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 2,
    borderColor: "#ffe4ff",
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  servicoCardActive: {
    backgroundColor: "#de638e",
    borderColor: "#951950",
    shadowOpacity: 0.15,
    elevation: 4,
  },
  servicoContent: {
    gap: 6,
  },
  servicoName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#951950",
  },
  servicoNameActive: {
    color: "#FFFFFF",
  },
  servicoDuracao: {
    fontSize: 12,
    color: "#de638e",
    fontWeight: "500",
  },
  servicoDuracaoActive: {
    color: "#ffe4ff",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#951950",
    alignItems: "center",
    justifyContent: "center",
  },

  // Input Styles
  inputsGrid: {
    gap: 12,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#951950",
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ffe4ff",
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#951950",
    fontWeight: "500",
    padding: 0,
  },

  // Error Styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#951950",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF4081",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "500",
    lineHeight: 18,
  },

  // Summary Card Styles
  summaryCard: {
    backgroundColor: "#f5c9d6",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#de638e",
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#951950",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#de638e",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#de638e",
    opacity: 0.3,
  },

  // Button Styles
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 10,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#de638e",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#de638e",
  },
  submitButton: {
    backgroundColor: "#de638e",
  },
  submitButtonDisabled: {
    backgroundColor: "#cba2ae",
    opacity: 0.8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})
