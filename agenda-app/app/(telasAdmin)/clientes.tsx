// agenda-app/app/(telasAdmin)/clientes.tsx

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

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  totalAgendamentos: number;
  ultimoAgendamento?: string;
  ativo: boolean;
}

export default function ClientesAdminScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    novos: 0,
    fidelizados: 0,
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
      
      const clientesData = [
        {
          id: "1",
          nome: "Maria Silva",
          email: "maria@email.com",
          telefone: "(11) 98765-4321",
          totalAgendamentos: 15,
          ultimoAgendamento: "2025-12-01",
          ativo: true,
        },
        {
          id: "2",
          nome: "João Santos",
          email: "joao@email.com",
          telefone: "(11) 98765-1234",
          totalAgendamentos: 8,
          ultimoAgendamento: "2025-11-28",
          ativo: true,
        },
        {
          id: "3",
          nome: "Ana Oliveira",
          email: "ana@email.com",
          telefone: "(11) 98765-5678",
          totalAgendamentos: 22,
          ultimoAgendamento: "2025-12-02",
          ativo: true,
        },
        {
          id: "4",
          nome: "Pedro Costa",
          email: "pedro@email.com",
          telefone: "(11) 98765-9999",
          totalAgendamentos: 3,
          ultimoAgendamento: "2025-10-15",
          ativo: false,
        },
      ];

      setClientes(clientesData);
      
      const ativos = clientesData.filter(c => c.ativo).length;
      const novos = clientesData.filter(c => c.totalAgendamentos <= 3).length;
      const fidelizados = clientesData.filter(c => c.totalAgendamentos >= 10).length;
      
      setStats({
        total: clientesData.length,
        ativos: ativos,
        novos: novos,
        fidelizados: fidelizados,
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalhes = (cliente: Cliente) => {
    Alert.alert(
      cliente.nome,
      `Email: ${cliente.email}\nTelefone: ${cliente.telefone}\nAgendamentos: ${cliente.totalAgendamentos}\nStatus: ${cliente.ativo ? 'Ativo' : 'Inativo'}`
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
            <Text style={styles.headerTitle}>Clientes</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="account-group"
              label="Total"
              value={stats.total.toString()}
              color="#B23A6D"
            />
            <StatCard
              icon="check-circle"
              label="Ativos"
              value={stats.ativos.toString()}
              color="#4CAF50"
            />
            <StatCard
              icon="account-plus"
              label="Novos"
              value={stats.novos.toString()}
              color="#D946A6"
            />
            <StatCard
              icon="star"
              label="Fidelizados"
              value={stats.fidelizados.toString()}
              color="#FF9800"
            />
          </View>

          {/* Lista de Clientes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todos os Clientes</Text>
            {clientes.map((cliente) => (
              <TouchableOpacity
                key={cliente.id}
                style={styles.clienteCard}
                onPress={() => verDetalhes(cliente)}
                activeOpacity={0.7}
              >
                <View style={styles.clienteLeft}>
                  <View style={[styles.clienteIcon, { backgroundColor: cliente.ativo ? "#FFE5F0" : "#F5F5F5" }]}>
                    <MaterialCommunityIcons 
                      name="account" 
                      size={24} 
                      color={cliente.ativo ? "#B23A6D" : "#999"} 
                    />
                  </View>
                  <View style={styles.clienteInfo}>
                    <Text style={styles.clienteNome}>{cliente.nome}</Text>
                    <Text style={styles.clienteEmail}>{cliente.email}</Text>
                  </View>
                </View>
                <View style={styles.clienteRight}>
                  <Text style={styles.clienteAgendamentos}>{cliente.totalAgendamentos} agend.</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: cliente.ativo ? "#4CAF5020" : "#F4433620" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: cliente.ativo ? "#4CAF50" : "#F44336" },
                      ]}
                    >
                      {cliente.ativo ? "ATIVO" : "INATIVO"}
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
                icon="calendar-plus"
                label="Novo Agendamento"
                color="#E85A8E"
                onPress={() => router.push("/(telasAdmin)/agendamentos")}
              />
              <ActionCard
                icon="spa"
                label="Gerenciar Serviços"
                color="#D946A6"
                onPress={() => router.push("/(telasAdmin)/servicos")}
              />
            </View>
            <View style={styles.actionsRow}>
              <ActionCard
                icon="view-dashboard"
                label="Dashboard"
                color="#B23A6D"
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
  clienteCard: {
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
  clienteLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  clienteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B23A6D",
  },
  clienteEmail: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  clienteRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  clienteAgendamentos: {
    fontSize: 12,
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
