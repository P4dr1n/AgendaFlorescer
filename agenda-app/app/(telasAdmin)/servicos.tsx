// agenda-app/app/(telasAdmin)/servicos.tsx

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

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  ativo: boolean;
}

export default function ServicosAdminScreen() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    faturamentoMedio: 0,
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
      
      const servicosData = [
        {
          id: "1",
          nome: "Massagem Relaxante",
          descricao: "Massagem completa de 60 minutos",
          preco: 150.00,
          duracao: 60,
          ativo: true,
        },
        {
          id: "2",
          nome: "Limpeza Facial",
          descricao: "Limpeza profunda e hidratação",
          preco: 120.00,
          duracao: 45,
          ativo: true,
        },
        {
          id: "3",
          nome: "Manicure",
          descricao: "Esmaltação com gel",
          preco: 50.00,
          duracao: 30,
          ativo: false,
        },
        {
          id: "4",
          nome: "Drenagem Linfática",
          descricao: "Tratamento estético 90 min",
          preco: 180.00,
          duracao: 90,
          ativo: true,
        },
      ];

      setServicos(servicosData);
      
      const ativos = servicosData.filter(s => s.ativo).length;
      const faturamento = servicosData.reduce((acc, s) => acc + s.preco, 0) / servicosData.length;
      
      setStats({
        total: servicosData.length,
        ativos: ativos,
        inativos: servicosData.length - ativos,
        faturamentoMedio: faturamento,
      });
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const editarServico = (servico: Servico) => {
    Alert.alert("Editar Serviço", `Editar: ${servico.nome}\nPreço: R$ ${servico.preco.toFixed(2)}\nDuração: ${servico.duracao} min`);
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
            <Text style={styles.headerTitle}>Serviços</Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="spa"
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
              icon="close-circle"
              label="Inativos"
              value={stats.inativos.toString()}
              color="#FF9800"
            />
            <StatCard
              icon="currency-usd"
              label="Ticket Médio"
              value={`R$ ${stats.faturamentoMedio.toFixed(0)}`}
              color="#D946A6"
            />
          </View>

          {/* Lista de Serviços */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todos os Serviços</Text>
            {servicos.map((servico) => (
              <TouchableOpacity
                key={servico.id}
                style={styles.servicoCard}
                onPress={() => editarServico(servico)}
                activeOpacity={0.7}
              >
                <View style={styles.servicoLeft}>
                  <View style={[styles.servicoIcon, { backgroundColor: servico.ativo ? "#FFE5F0" : "#F5F5F5" }]}>
                    <MaterialCommunityIcons 
                      name="spa" 
                      size={24} 
                      color={servico.ativo ? "#B23A6D" : "#999"} 
                    />
                  </View>
                  <View style={styles.servicoInfo}>
                    <Text style={styles.servicoNome}>{servico.nome}</Text>
                    <Text style={styles.servicoDescricao}>{servico.descricao}</Text>
                  </View>
                </View>
                <View style={styles.servicoRight}>
                  <Text style={styles.servicoPreco}>R$ {servico.preco.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: servico.ativo ? "#4CAF5020" : "#F4433620" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: servico.ativo ? "#4CAF50" : "#F44336" },
                      ]}
                    >
                      {servico.ativo ? "ATIVO" : "INATIVO"}
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
                color="#D946A6"
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
  servicoCard: {
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
  servicoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  servicoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  servicoInfo: {
    flex: 1,
  },
  servicoNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B23A6D",
  },
  servicoDescricao: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  servicoRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  servicoPreco: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
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
