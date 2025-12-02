// agenda-app/app/(telasCliente)/NossosServicos.tsx

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
  id: string;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
  ativo: boolean;
}

export default function NossosServicosScreen() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarServicos();
    }, [])
  );

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/servicos");
      setServicos(response.data.filter((s: Servico) => s.ativo));
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      Alert.alert("Erro", "Não foi possível carregar os serviços");
    } finally {
      setLoading(false);
    }
  };

  const formatarDuracao = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos}min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  };

  const handleAgendar = () => {
    router.push("/(telasCliente)/agendar");
  };

  const getIconForService = (nome: string) => {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes("massagem")) return "spa";
    if (nomeLower.includes("facial") || nomeLower.includes("limpeza")) return "face-woman";
    if (nomeLower.includes("manicure") || nomeLower.includes("unha")) return "hand-heart";
    if (nomeLower.includes("cabelo") || nomeLower.includes("corte")) return "content-cut";
    if (nomeLower.includes("depilação")) return "laser-pointer";
    if (nomeLower.includes("maquiagem")) return "palette";
    return "flower";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
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
        <Text style={styles.headerTitle}>Nossos Serviços</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <MaterialCommunityIcons name="spa" size={32} color="#FF4081" />
          </View>
          <Text style={styles.introTitle}>Bem-vindo ao Florescer</Text>
          <Text style={styles.introSubtitle}>
            Oferecemos tratamentos naturais e paliativos para o seu bem-estar completo.
          </Text>
        </View>

        {servicos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="flower-outline" size={64} color="#cba2ae" />
            <Text style={styles.emptyTitle}>Nenhum serviço disponível</Text>
            <Text style={styles.emptySubtitle}>Em breve teremos novidades!</Text>
          </View>
        ) : (
          servicos.map((servico) => (
            <View key={servico.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIcon}>
                  <MaterialCommunityIcons
                    name={getIconForService(servico.nome) as any}
                    size={28}
                    color="#FF4081"
                  />
                </View>
                <View style={styles.serviceHeaderInfo}>
                  <Text style={styles.serviceName}>{servico.nome}</Text>
                  <View style={styles.serviceMetaRow}>
                    <View style={styles.serviceMeta}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color="#951950" />
                      <Text style={styles.serviceMetaText}>{formatarDuracao(servico.duracao)}</Text>
                    </View>
                    <View style={styles.serviceMeta}>
                      <MaterialCommunityIcons name="currency-usd" size={14} color="#951950" />
                      <Text style={styles.serviceMetaText}>R$ {servico.preco.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {servico.descricao && (
                <>
                  <View style={styles.serviceDivider} />
                  <Text style={styles.serviceDescription}>{servico.descricao}</Text>
                </>
              )}

              <TouchableOpacity
                style={styles.serviceButton}
                onPress={handleAgendar}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="calendar-plus" size={18} color="#FFFFFF" />
                <Text style={styles.serviceButtonText}>Agendar Este Serviço</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.ctaCard}>
          <MaterialCommunityIcons name="information-outline" size={24} color="#FF4081" />
          <Text style={styles.ctaText}>
            Todos os nossos serviços são realizados por profissionais qualificados
          </Text>
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAgendar}
          activeOpacity={0.9}
        >
          <MaterialCommunityIcons name="calendar-plus" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>Agendar Agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
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
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
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
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 12,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  introIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#951950",
    letterSpacing: -0.5,
  },
  introSubtitle: {
    fontSize: 15,
    color: "#cba2ae",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#951950",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#cba2ae",
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: "row",
    gap: 16,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF80AB",
  },
  serviceHeaderInfo: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#951950",
    letterSpacing: -0.2,
  },
  serviceMetaRow: {
    flexDirection: "row",
    gap: 16,
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceMetaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#951950",
  },
  serviceDivider: {
    height: 1,
    backgroundColor: "#f5c9d6",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#2D2D2D",
    lineHeight: 20,
  },
  serviceButton: {
    backgroundColor: "#FF4081",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  ctaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FFB3D0",
  },
  ctaText: {
    flex: 1,
    fontSize: 14,
    color: "#951950",
    fontWeight: "600",
    lineHeight: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFD3E0",
  },
  floatingButton: {
    backgroundColor: "#FF4081",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
