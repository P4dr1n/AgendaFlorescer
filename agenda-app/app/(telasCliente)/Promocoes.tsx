// agenda-app/app/(telasCliente)/Promocoes.tsx

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
} from "react-native";

interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  desconto: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

export default function PromocoesScreen() {
  const router = useRouter();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarPromocoes();
    }, [])
  );

  const carregarPromocoes = async () => {
    setLoading(true);
    // Simulação de dados mockados (substitua pela chamada real da API)
    setTimeout(() => {
      const promocoesMock: Promocao[] = [
        {
          id: "1",
          titulo: "Massagem Relaxante",
          descricao: "Aproveite 30% de desconto em sessões de massagem relaxante",
          desconto: 30,
          dataInicio: "2025-12-01",
          dataFim: "2025-12-31",
          ativo: true,
        },
        {
          id: "2",
          titulo: "Pacote Bem-Estar",
          descricao: "Limpeza facial + Massagem por um preço especial",
          desconto: 25,
          dataInicio: "2025-12-01",
          dataFim: "2025-12-15",
          ativo: true,
        },
        {
          id: "3",
          titulo: "Natal Especial",
          descricao: "Ganhe 20% em todos os serviços durante dezembro",
          desconto: 20,
          dataInicio: "2025-12-01",
          dataFim: "2025-12-25",
          ativo: true,
        },
      ];
      setPromocoes(promocoesMock);
      setLoading(false);
    }, 800);
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
  };

  const calcularDiasRestantes = (dataFim: string) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diff = fim.getTime() - hoje.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const getPromoIcon = (titulo: string) => {
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes("massagem")) return "spa";
    if (tituloLower.includes("facial") || tituloLower.includes("pacote")) return "gift";
    if (tituloLower.includes("natal")) return "pine-tree";
    return "tag-heart";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando promoções...</Text>
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
        <Text style={styles.headerTitle}>Promoções</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <MaterialCommunityIcons name="party-popper" size={40} color="#FF4081" />
          </View>
          <Text style={styles.bannerTitle}>Ofertas Especiais!</Text>
          <Text style={styles.bannerSubtitle}>
            Aproveite nossas promoções exclusivas de dezembro
          </Text>
        </View>

        {promocoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="sale-outline" size={64} color="#cba2ae" />
            <Text style={styles.emptyTitle}>Nenhuma promoção ativa</Text>
            <Text style={styles.emptySubtitle}>Fique de olho para não perder as novidades!</Text>
          </View>
        ) : (
          promocoes.map((promo) => {
            const diasRestantes = calcularDiasRestantes(promo.dataFim);
            return (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoHeader}>
                  <View style={styles.promoIcon}>
                    <MaterialCommunityIcons
                      name={getPromoIcon(promo.titulo) as any}
                      size={32}
                      color="#FF4081"
                    />
                  </View>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{promo.desconto}%</Text>
                    <Text style={styles.discountLabel}>OFF</Text>
                  </View>
                </View>

                <View style={styles.promoBody}>
                  <Text style={styles.promoTitle}>{promo.titulo}</Text>
                  <Text style={styles.promoDescription}>{promo.descricao}</Text>
                </View>

                <View style={styles.promoDivider} />

                <View style={styles.promoFooter}>
                  <View style={styles.promoDate}>
                    <MaterialCommunityIcons name="calendar-range" size={16} color="#951950" />
                    <Text style={styles.promoDateText}>
                      Válido até {formatarData(promo.dataFim)}
                    </Text>
                  </View>
                  {diasRestantes > 0 && diasRestantes <= 7 && (
                    <View style={styles.urgentBadge}>
                      <MaterialCommunityIcons name="clock-alert" size={14} color="#FF6B35" />
                      <Text style={styles.urgentText}>
                        {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"} restantes
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.promoButton}
                  onPress={() => router.push("/(telasCliente)/agendar")}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="star" size={18} color="#FFFFFF" />
                  <Text style={styles.promoButtonText}>Aproveitar Oferta</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={20} color="#FF4081" />
          <Text style={styles.infoText}>
            Os descontos são aplicados automaticamente no agendamento
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    paddingHorizontal: 24,
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
  bannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  bannerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#951950",
    letterSpacing: -0.5,
  },
  bannerSubtitle: {
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
    textAlign: "center",
    paddingHorizontal: 20,
  },
  promoCard: {
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
  promoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  promoIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF80AB",
  },
  discountBadge: {
    backgroundColor: "#FF4081",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  discountText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  discountLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  promoBody: {
    gap: 8,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#951950",
    letterSpacing: -0.3,
  },
  promoDescription: {
    fontSize: 15,
    color: "#2D2D2D",
    lineHeight: 22,
  },
  promoDivider: {
    height: 1,
    backgroundColor: "#f5c9d6",
  },
  promoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  promoDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  promoDateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#951950",
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFE5DC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6B35",
  },
  promoButton: {
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
  promoButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#FFB3D0",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#951950",
    fontWeight: "600",
    lineHeight: 18,
  },
});
