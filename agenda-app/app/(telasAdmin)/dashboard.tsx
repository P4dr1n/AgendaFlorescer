// agenda-app/app/(telasAdmin)/dashboard.tsx

import { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import api from "../../services/api";

const { width } = Dimensions.get("window");

interface DashboardStats {
  agendamentosHoje: number;
  agendamentosSemana: number;
  clientesTotal: number;
  servicosAtivos: number;
  faturamentoMes: number;
  taxaConclusao: number;
}

interface AgendamentoRecente {
  id: string;
  cliente: string;
  servico: string;
  data: string;
  status: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    agendamentosHoje: 0,
    agendamentosSemana: 0,
    clientesTotal: 0,
    servicosAtivos: 0,
    faturamentoMes: 0,
    taxaConclusao: 0,
  });

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Simular dados - substitua pela chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        agendamentosHoje: 8,
        agendamentosSemana: 32,
        clientesTotal: 45,
        servicosAtivos: 12,
        faturamentoMes: 8500.00,
        taxaConclusao: 92,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFE8F0" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE8F0" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Admin */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{user?.usuario || "Admin"}</Text>
            <View style={styles.adminBadge}>
              <MaterialCommunityIcons name="shield-crown" size={12} color="#FF4081" />
              <Text style={styles.adminBadgeText}>Administrador</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#951950" />
            {stats.agendamentosHoje > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{stats.agendamentosHoje}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="calendar-today"
            label="Hoje"
            value={stats.agendamentosHoje.toString()}
            color="#FF4081"
            bgColor="#FFE8F0"
          />
          <StatCard
            icon="calendar-week"
            label="Esta Semana"
            value={stats.agendamentosSemana.toString()}
            color="#951950"
            bgColor="#F5D9E5"
          />
          <StatCard
            icon="account-group"
            label="Clientes"
            value={stats.clientesTotal.toString()}
            color="#D81B60"
            bgColor="#FCE4EC"
          />
          <StatCard
            icon="check-circle"
            label="Taxa Sucesso"
            value={`${stats.taxaConclusao}%`}
            color="#C2185B"
            bgColor="#F8BBD0"
          />
        </View>

        {/* Faturamento Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <View style={styles.revenueIcon}>
              <MaterialCommunityIcons name="cash-multiple" size={32} color="#4CAF50" />
            </View>
            <View style={styles.revenueInfo}>
              <Text style={styles.revenueLabel}>Faturamento Mensal</Text>
              <Text style={styles.revenueValue}>
                R$ {stats.faturamentoMes.toFixed(2).replace(".", ",")}
              </Text>
              <View style={styles.revenueFooter}>
                <MaterialCommunityIcons name="trending-up" size={14} color="#4CAF50" />
                <Text style={styles.revenueFooterText}>
                  {stats.servicosAtivos} serviços ativos
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="calendar-plus"
              label="Agendamento"
              color="#FF4081"
              onPress={() => router.push("/(telasAdmin)/agendamentos")}
            />
            <QuickAction
              icon="spa"
              label="Gerenciar Serviços"
              color="#951950"
              onPress={() => router.push("/(telasAdmin)/servicos")}
            />
            <QuickAction
              icon="account-plus"
              label="Ver Clientes"
              color="#D81B60"
              onPress={() => router.push("/(telasAdmin)/clientes")}
            />
            <QuickAction
              icon="cog"
              label="Perfil"
              color="#C2185B"
              onPress={() => router.push("/(telasAdmin)/perfil")}
            />
          </View>
        </View>

        {/* Dica do dia */}
        <View style={styles.tipCard}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FF9800" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Dica de Gestão</Text>
            <Text style={styles.tipText}>
              Confirme os agendamentos de hoje para melhorar a taxa de comparecimento
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({
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
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFE8F0",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#951950",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  greeting: {
    color: "#951950",
    fontSize: 16,
    fontWeight: "500",
  },
  userName: {
    color: "#951950",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.5,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FF408120",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  adminBadgeText: {
    color: "#FF4081",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF4081",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFE8F0",
  },
  notificationCount: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  statLabel: {
    color: "#951950",
    fontSize: 13,
    fontWeight: "600",
  },
  revenueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  revenueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  revenueIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#4CAF5020",
    alignItems: "center",
    justifyContent: "center",
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    color: "#951950",
    fontSize: 14,
    fontWeight: "600",
  },
  revenueValue: {
    color: "#951950",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.5,
  },
  revenueFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  revenueFooterText: {
    color: "#4CAF50",
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#951950",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    width: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    color: "#951950",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FFE082",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: "#F57C00",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  tipText: {
    color: "#E65100",
    fontSize: 13,
    lineHeight: 18,
  },
});
