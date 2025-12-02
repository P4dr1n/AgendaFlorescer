// agenda-app/app/(telasCliente)/MeusAgendamentos.tsx

import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";

interface Servico {
  nome: string;
  duracao: number;
  preco: number;
}

interface Profissional {
  nome: string;
}

interface Agendamento {
  id: string;
  data: string;
  status: string;
  servico: Servico;
  profissional: Profissional;
}

export default function MeusAgendamentosScreen() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"TODOS" | "PENDENTE" | "CONFIRMADO" | "CANCELADO">("TODOS");

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleCancelar = async (id: string) => {
    Alert.alert(
      "Cancelar Agendamento",
      "Você realmente deseja cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.patch(`/api/agendamentos/${id}/cancelar`);
              Alert.alert("Sucesso", "Agendamento cancelado");
              carregarAgendamentos();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar");
            }
          },
        },
      ]
    );
  };

  const agendamentosFiltrados = agendamentos.filter((ag) =>
    filtro === "TODOS" ? true : ag.status === filtro
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return "#4CAF50";
      case "PENDENTE":
        return "#FF9800";
      case "CANCELADO":
        return "#F44336";
      default:
        return "#951950";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return "Confirmado";
      case "PENDENTE":
        return "Pendente";
      case "CANCELADO":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#951950" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <FilterChip
          label="Todos"
          active={filtro === "TODOS"}
          onPress={() => setFiltro("TODOS")}
        />
        <FilterChip
          label="Pendente"
          active={filtro === "PENDENTE"}
          onPress={() => setFiltro("PENDENTE")}
        />
        <FilterChip
          label="Confirmado"
          active={filtro === "CONFIRMADO"}
          onPress={() => setFiltro("CONFIRMADO")}
        />
        <FilterChip
          label="Cancelado"
          active={filtro === "CANCELADO"}
          onPress={() => setFiltro("CANCELADO")}
        />
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {agendamentosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="calendar-blank" size={64} color="#cba2ae" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
            <Text style={styles.emptySubtitle}>
              {filtro === "TODOS"
                ? "Você ainda não possui agendamentos"
                : `Nenhum agendamento ${getStatusLabel(filtro).toLowerCase()}`}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/(telasCliente)/agendar")}
            >
              <Text style={styles.emptyButtonText}>Agendar Agora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          agendamentosFiltrados.map((agendamento) => (
            <View key={agendamento.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>{formatarData(agendamento.data).split(" ")[0]}</Text>
                  <Text style={styles.dateMonth}>{formatarData(agendamento.data).split(" ")[1]}</Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>{agendamento.servico.nome}</Text>
                  <View style={styles.row}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#951950" />
                    <Text style={styles.cardTime}>{formatarHora(agendamento.data)}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agendamento.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(agendamento.status) }]}>
                    {getStatusLabel(agendamento.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="account" size={16} color="#951950" />
                  <Text style={styles.detailText}>{agendamento.profissional.nome}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="timer-outline" size={16} color="#951950" />
                  <Text style={styles.detailText}>{agendamento.servico.duracao} minutos</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="currency-usd" size={16} color="#951950" />
                  <Text style={styles.detailText}>R$ {agendamento.servico.preco.toFixed(2)}</Text>
                </View>
              </View>

              {agendamento.status !== "CANCELADO" && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionSecondary]}
                    onPress={() => handleCancelar(agendamento.id)}
                  >
                    <MaterialCommunityIcons name="close-circle-outline" size={18} color="#FF4081" />
                    <Text style={styles.actionSecondaryText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionPrimary]}
                    onPress={() => {}}
                  >
                    <MaterialCommunityIcons name="map-marker" size={18} color="#FFFFFF" />
                    <Text style={styles.actionPrimaryText}>Como Chegar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFD3E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#951950",
    letterSpacing: -0.3,
  },
  filterScroll: {
    maxHeight: 60,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FFB3D0",
  },
  filterChipActive: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  filterChipText: {
    color: "#951950",
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#951950",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    gap: 16,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#951950",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#cba2ae",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: "#FF4081",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 16,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dateBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF80AB",
  },
  dateDay: {
    fontSize: 22,
    fontWeight: "800",
    color: "#951950",
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF4081",
    textTransform: "uppercase",
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#951950",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#951950",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f5c9d6",
  },
  cardDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionSecondary: {
    backgroundColor: "#ffe4ff",
    borderWidth: 1.5,
    borderColor: "#FF80AB",
  },
  actionSecondaryText: {
    color: "#FF4081",
    fontSize: 13,
    fontWeight: "700",
  },
  actionPrimary: {
    backgroundColor: "#FF4081",
  },
  actionPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
