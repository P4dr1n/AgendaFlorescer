// agenda-app/app/(telasCliente)/AgendaProfissional.tsx

import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../services/api";
import { useUser } from "../../contexts/UserContext";

interface Agendamento {
  id: string;
  data: string;
  status: string;
  servico: {
    nome: string;
    duracao: number;
    preco: number;
  };
  cliente: {
    id: string;
    usuario: string;
    telefone: string | null;
    email: string;
  };
}

interface Profissional {
  id: string;
  nome: string;
  especialidade?: string;
}

export default function AgendaProfissionalScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      Alert.alert("Acesso Negado", "Você não tem permissão para acessar esta tela", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      carregarProfissionais();
    }
  }, [user]);

  useEffect(() => {
    if (profissionalSelecionado) {
      carregarAgendamentos();
    }
  }, [profissionalSelecionado, dataSelecionada]);

  const carregarProfissionais = async () => {
    try {
      const response = await api.get("/api/profissionais");
      setProfissionais(response.data);
      if (response.data.length > 0) {
        setProfissionalSelecionado(response.data[0]);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar profissionais");
    }
  };

  const carregarAgendamentos = async () => {
    if (!profissionalSelecionado) return;

    try {
      setLoading(true);
      const ano = dataSelecionada.getFullYear();
      const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
      const dia = String(dataSelecionada.getDate()).padStart(2, "0");
      const dataFormatada = `${ano}-${mes}-${dia}`;

      console.log('🔍 Buscando agendamentos para:', profissionalSelecionado.nome, 'Data:', dataFormatada);

      const response = await api.get(
        `/api/agendamentos/profissional/${profissionalSelecionado.id}?data=${dataFormatada}`
      );

      console.log('✅ Agendamentos recebidos:', response.data);
      setAgendamentos(response.data);
    } catch (error: any) {
      console.error("❌ Erro ao carregar agendamentos:", error);
      console.error("Detalhes:", error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarAgendamentos();
  };

  const atualizarStatus = async (agendamentoId: string, novoStatus: string) => {
    try {
      await api.patch(`/api/agendamentos/${agendamentoId}/status`, {
        status: novoStatus,
      });
      Alert.alert("Sucesso", `Agendamento atualizado para ${novoStatus}`);
      carregarAgendamentos();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status");
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: '2-digit',
      month: 'long',
    });
  };

  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDENTE":
        return "#FFA500";
      case "CONFIRMADO":
        return "#4CAF50";
      case "CANCELADO":
        return "#F44336";
      case "CONCLUIDO":
        return "#2196F3";
      default:
        return "#999";
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#951950" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agenda Profissional</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Profissional</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.profScroll}>
          {profissionais.map((prof) => (
            <TouchableOpacity
              key={prof.id}
              style={[
                styles.profChip,
                profissionalSelecionado?.id === prof.id && styles.profChipSelected,
              ]}
              onPress={() => setProfissionalSelecionado(prof)}
            >
              <Text
                style={[
                  styles.profChipText,
                  profissionalSelecionado?.id === prof.id && styles.profChipTextSelected,
                ]}
              >
                {prof.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <MaterialCommunityIcons name="calendar" size={20} color="#951950" />
          <Text style={styles.dateButtonText}>{formatarData(dataSelecionada.toISOString())}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dataSelecionada}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDataSelecionada(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.agendamentosHeader}>
        <Text style={styles.agendamentosTitle}>
          {agendamentos.length} agendamento{agendamentos.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.agendamentosList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF4081"]} />}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4081" />
          </View>
        ) : agendamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum agendamento nesta data</Text>
          </View>
        ) : (
          agendamentos.map((agendamento) => (
            <View key={agendamento.id} style={styles.agendamentoCard}>
              <View style={styles.agendamentoHeader}>
                <View style={styles.horarioBox}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#951950" />
                  <Text style={styles.horarioText}>{formatarHora(agendamento.data)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agendamento.status) }]}>
                  <Text style={styles.statusText}>{agendamento.status}</Text>
                </View>
              </View>

              <View style={styles.agendamentoBody}>
                {/* ✅ NOME DO CLIENTE EM DESTAQUE */}
                <View style={styles.clienteDestaque}>
                  <MaterialCommunityIcons name="account-circle" size={24} color="#FF4081" />
                  <View>
                    <Text style={styles.clienteLabel}>Cliente</Text>
                    <Text style={styles.clienteNome}>{agendamento.cliente.usuario}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="spa" size={16} color="#666" />
                  <Text style={styles.infoText}>{agendamento.servico.nome}</Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="timer-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{agendamento.servico.duracao} minutos</Text>
                </View>

                {agendamento.cliente.telefone && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone" size={16} color="#666" />
                    <Text style={styles.infoText}>{agendamento.cliente.telefone}</Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={16} color="#666" />
                  <Text style={styles.infoText}>{agendamento.cliente.email}</Text>
                </View>
              </View>

              {agendamento.status.toUpperCase() === "PENDENTE" && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => atualizarStatus(agendamento.id, "CONFIRMADO")}
                  >
                    <MaterialCommunityIcons name="check" size={18} color="#FFF" />
                    <Text style={styles.actionButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => atualizarStatus(agendamento.id, "CANCELADO")}
                  >
                    <MaterialCommunityIcons name="close" size={18} color="#FFF" />
                    <Text style={styles.actionButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {agendamento.status.toUpperCase() === "CONFIRMADO" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => atualizarStatus(agendamento.id, "CONCLUIDO")}
                >
                  <MaterialCommunityIcons name="check-all" size={18} color="#FFF" />
                  <Text style={styles.actionButtonText}>Marcar como Concluído</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    paddingBottom: 16,
  },
  backBtn: { marginRight: 12 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#951950",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  label: {
    color: "#951950",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  profScroll: {
    paddingRight: 24,
  },
  profChip: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
  },
  profChipSelected: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  profChipText: {
    color: "#951950",
    fontWeight: "600",
    fontSize: 14,
  },
  profChipTextSelected: {
    color: "#FFF",
  },
  dateButton: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
  },
  dateButtonText: {
    color: "#2D2D2D",
    fontSize: 15,
    fontWeight: "600",
  },
  agendamentosHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  agendamentosTitle: {
    color: "#951950",
    fontSize: 18,
    fontWeight: "700",
  },
  agendamentosList: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
  agendamentoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  agendamentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5c9d6",
  },
  horarioBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  horarioText: {
    color: "#951950",
    fontSize: 18,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  agendamentoBody: {
    gap: 12,
  },
  // ✅ ESTILOS PARA DESTAQUE DO CLIENTE
  clienteDestaque: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffe4ff",
    padding: 12,
    borderRadius: 12,
  },
  clienteLabel: {
    fontSize: 11,
    color: "#951950",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clienteNome: {
    fontSize: 18,
    color: "#951950",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#f5c9d6",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  completeButton: {
    backgroundColor: "#2196F3",
    width: "100%",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
