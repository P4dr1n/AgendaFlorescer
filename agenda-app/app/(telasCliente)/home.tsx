"use client"

import { useEffect, useMemo, useState } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getProfileRequest } from "@/lib/api"
import { getAuthToken } from "@/lib/auth-storage"


const SCREEN_WIDTH = Dimensions.get("window").width
const H_PADDING = 24 
const GRID_GAP = 12
const ITEM_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GRID_GAP) / 2)

export default function HomeClienteScreen() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("Cliente")

  const proximo = useMemo(
    () => ({ servico: "Limpeza de Pele Avançada", profissional: "Joana", data: "Amanhã, 14/10", hora: "15:00" }),
    [],
  )

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const token = await getAuthToken()
        if (!token) {
          return
        }
        const profile = await getProfileRequest(token)
        if (active && profile?.usuario) {
          setUserName(profile.usuario)
        }
      } catch (error) {
        console.warn("Falha ao carregar perfil do usuário", error)
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hello}>Olá,</Text>
            <Text style={styles.userName}>{userName || "Cliente"}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}} activeOpacity={0.8}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#FF4081" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#FF4081" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Próximo Agendamento</Text>
              <Text style={styles.cardSubtitle}>Detalhes da sua consulta</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="spa" size={18} color="#951950" />
              <Text style={styles.detailLabel}>Serviço</Text>
            </View>
            <Text style={styles.detailValue}>{proximo.servico}</Text>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={18} color="#951950" />
              <Text style={styles.detailLabel}>Profissional</Text>
            </View>
            <Text style={styles.detailValue}>{proximo.profissional}</Text>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#951950" />
              <Text style={styles.detailLabel}>Data e Hora</Text>
            </View>
            <Text style={styles.detailValue}>
              {proximo.data}, às {proximo.hora}
            </Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionSecondary]} onPress={() => {}}>
              <MaterialCommunityIcons name="calendar-edit" size={16} color="#FF4081" />
              <Text style={styles.actionSecondaryText}>Remarcar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]} onPress={() => {}}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#FFFFFF" />
              <Text style={styles.actionPrimaryText}>Como chegar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => {}}>
            <Text style={styles.cancelText}>Cancelar agendamento</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryCta} onPress={() => {}} activeOpacity={0.9}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
          <Text style={styles.primaryCtaText}>Agendar Novo Horário</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickGrid}>
          <QuickItem icon="calendar-month" label="Meus Agendamentos" onPress={() => {}} />
          <QuickItem icon="spa" label="Nossos Serviços" onPress={() => {}} />
          <QuickItem icon="tag" label="Promoções" onPress={() => {}} />
          <QuickItem icon="account-circle" label="Meu Perfil" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function QuickItem({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickItem} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.quickIconWrap}>
        <MaterialCommunityIcons name={icon} size={26} color="#FF4081" />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFD3E0",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hello: {
    color: "#951950", 
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  userName: {
    color: "#951950", 
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF", 
    shadowColor: "#FF4081", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: "#951950", 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffe4ff", 
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: "#951950", 
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    color: "#cba2ae", 
    fontSize: 14,
    fontWeight: "500",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f5c9d6", 
    marginVertical: 4,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    color: "#951950", 
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    color: "#2D2D2D",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 26,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionSecondary: {
    backgroundColor: "#ffe4ff",
    borderWidth: 1.5,
    borderColor: "#FF80AB",
  },
  actionSecondaryText: {
    color: "#FF4081", 
    fontWeight: "700",
    fontSize: 14,
  },
  actionPrimary: {
    backgroundColor: "#FF4081", 
  },
  actionPrimaryText: {
    color: "#FFFFFF", 
    fontWeight: "700",
    fontSize: 14,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {
    color: "#cba2ae", 
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  primaryCta: {
    backgroundColor: "#FF4081", 
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryCtaText: {
    color: "#FFFFFF", 
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  sectionTitle: {
    color: "#951950", 
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 8,
    marginBottom: -4,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickItem: {
    width: ITEM_WIDTH,
    marginBottom: 14,
    backgroundColor: "#FFFFFF", 
    borderRadius: 20,
    padding: 20,
    gap: 12,
    alignItems: "center",
    shadowColor: "#951950", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe4ff", 
  },
  quickLabel: {
    color: "#951950", 
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
})
