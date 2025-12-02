// agenda-app/app/(telasAdmin)/agendamentos.tsx

import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface Agendamento {
  id: string;
  clienteNome: string;
  servicoNome: string;
  data: string;
  hora: string;
  status: string;
}

export default function AgendamentosAdminScreen() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hoje: 0,
    semana: 0,
    pendentes: 0,
    confirmados: 0,
  });

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const agendamentosData = [
        {
          id: "1",
          clienteNome: "Maria Silva",
          servicoNome: "Massagem Relaxante",
          data: "2025-12-02",
          hora: "14:30",
          status: "CONFIRMADO",
        },
        {
          id: "2",
          clienteNome: "João Santos",
          servicoNome: "Limpeza Facial",
          data: "2025-12-03",
          hora: "10:00",
          status: "PENDENTE",
        },
        {
          id: "3",
          clienteNome: "Ana Oliveira",
          servicoNome: "Manicure",
          data: "2025-12-02",
          hora: "16:15",
          status: "CONFIRMADO",
        },
      ];

      setAgendamentos(agendamentosData);
      setStats({
        hoje: 2,
        semana: 8,
        pendentes: 1,
        confirmados: 2,
      });
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalhes = (agendamento: Agendamento) => {
    Alert.alert(
      agendamento.clienteNome,
      `Serviço: ${agendamento.servicoNome}\nData: ${agendamento.data}\nHora: ${agendamento.hora}\nStatus: ${agendamento.status}`
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={["#FFE5F0", "#FFF0F7", "#FFFFFF"]} style={styles.gradient}>
        <SafeAreaView style={styles.safe}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B23A6D" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFE5F0", "#FFF0F7", "#FFFFFF"]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Agendamentos</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="calendar-today"
              label="Hoje"
              value={stats.hoje.toString()}
              color="#B23A6D"
            />
            <StatCard
              icon="calendar-week"
              label="Esta Semana"
              value={stats.semana.toString()}
              color="#D946A6"
            />
            <StatCard
              icon="clock-outline"
              label="Pendentes"
              value={stats.pendentes.toString()}
              color="#FF9800"
            />
            <StatCard
              icon="check-circle"
              label="Confirmados"
              value={stats.confirmados.toString()}
              color="#4CAF50"
            />
          </View>

          {/* Próximos Agendamentos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
            {agendamentos.map((agendamento) => (
              <TouchableOpacity
                key={agendamento.id}
                style={styles.agendamentoCard}
                onPress={() => verDetalhes(agendamento)}
                activeOpacity={0.7}
              >
                <View style={styles.agendamentoLeft}>
                  <View style={styles.agendamentoIcon}>
                    <MaterialCommunityIcons name="account" size={24} color="#B23A6D" />
                  </View>
                  <View style={styles.agendamentoInfo}>
                    <Text style={styles.agendamentoCliente}>{agendamento.clienteNome}</Text>
                    <Text style={styles.agendamentoServico}>{agendamento.servicoNome}</Text>
                  </View>
                </View>
                <View style={styles.agendamentoRight}>
                  <Text style={styles.agendamentoHora}>{agendamento.hora}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          agendamento.status === "CONFIRMADO" ? "#4CAF5020" : "#FF980020",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: agendamento.status === "CONFIRMADO" ? "#4CAF50" : "#FF9800",
                        },
                      ]}
                    >
                      {agendamento.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ações Rápidas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
            <View style={styles.actionsRow}>
              <ActionCard
                icon="spa"
                label="Gerenciar Serviços"
                color="#D946A6"
                onPress={() => router.push("/(telasAdmin)/servicos")}
              />
              <ActionCard
                icon="account-group"
                label="Ver Clientes"
                color="#B23A6D"
                onPress={() => router.push("/(telasAdmin)/clientes")}
              />
            </View>
            <View style={styles.actionsRow}>
              <ActionCard
                icon="view-dashboard"
                label="Dashboard"
                color="#E85A8E"
                onPress={() => router.push("/(telasAdmin)/dashboard")}
              />
              <ActionCard
                icon="account"
                label="Perfil"
                color="#FF4081"
                onPress={() => router.push("/(telasAdmin)/perfil")}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  label,
  color,
  onPress,
}: {
  icon: any;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#B23A6D",
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#B23A6D",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#B23A6D",
    letterSpacing: -0.3,
  },
  agendamentoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  agendamentoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  agendamentoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE5F0",
    alignItems: "center",
    justifyContent: "center",
  },
  agendamentoInfo: {
    flex: 1,
  },
  agendamentoCliente: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B23A6D",
  },
  agendamentoServico: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  agendamentoRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  agendamentoHora: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B23A6D",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B23A6D",
    textAlign: "center",
  },
});
