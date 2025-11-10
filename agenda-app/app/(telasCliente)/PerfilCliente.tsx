"use client"

import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native"
import { useUser } from "../../contexts/UserContext"

export default function PerfilCliente() {
  const router = useRouter()
  const { user } = useUser()

  const confirmarSaida = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => router.replace("/login"),
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF4081" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account" size={48} color="#FF4081" />
          </View>
          <Text style={styles.userName}>{user.nome}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <ProfileItem icon="email-outline" label="E-mail" value={user.email} />
          <ProfileItem icon="phone-outline" label="Telefone" value={user.telefone} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções</Text>
          <ActionItem
            icon="cog-outline"
            label="Configurações"
            onPress={() => router.push("/Configuracao")}
          />
          <ActionItem icon="logout" label="Sair da Conta" color="#FF4081" onPress={confirmarSaida} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function ProfileItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.profileItem}>
      <View style={styles.iconRow}>
        <MaterialCommunityIcons name={icon} size={20} color="#951950" />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  )
}

function ActionItem({
  icon,
  label,
  color = "#951950",
  onPress,
}: {
  icon: any
  label: string
  color?: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.85}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
  content: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 24, gap: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#951950", fontSize: 28, fontWeight: "800" },
  iconButton: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 32,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffe4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: { color: "#951950", fontSize: 22, fontWeight: "800" },
  userEmail: { color: "#cba2ae", fontSize: 15, marginTop: 4 },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileItem: { gap: 6 },
  iconRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemLabel: {
    color: "#951950",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemValue: { color: "#2D2D2D", fontSize: 16, fontWeight: "600", marginLeft: 28 },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#951950",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: { color: "#951950", fontSize: 18, fontWeight: "700", marginLeft: 20, marginBottom: 12 },
  actionItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 24 },
  actionLabel: { fontSize: 16, fontWeight: "700" },
})