// agenda-app/app/(telasCliente)/PerfilCliente.tsx

"use client";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { useUser } from "../../contexts/UserContext";

export default function PerfilCliente() {
  const router = useRouter();
  const { user, logout, loading } = useUser();

  const confirmarSaida = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
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
          <Text style={styles.userName}>{user.usuario}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {/* Badge de Role */}
          <View style={[
            styles.roleBadge, 
            { backgroundColor: user.role === 'ADMIN' ? '#FF4081' : '#4CAF50' }
          ]}>
            <MaterialCommunityIcons 
              name={user.role === 'ADMIN' ? 'shield-crown' : 'account-check'} 
              size={14} 
              color="#FFF" 
            />
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <ProfileItem icon="email-outline" label="E-mail" value={user.email} />
          <ProfileItem 
            icon="phone-outline" 
            label="Telefone" 
            value={user.telefone || "Não informado"} 
          />
          <ProfileItem 
            icon="account-outline" 
            label="Usuário" 
            value={user.usuario} 
          />
          <ProfileItem 
            icon="shield-account" 
            label="Tipo de Conta" 
            value={user.role} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções</Text>
          
          {user.role === 'ADMIN' && (
            <ActionItem
              icon="clipboard-text"
              label="Agenda Profissional"
              onPress={() => router.push("/(telasCliente)/AgendaProfissional" as any)}
            />
          )}
          
          <ActionItem
            icon="calendar-month"
            label="Meus Agendamentos"
            onPress={() => router.push("/(telasCliente)/home")}
          />
          
          <ActionItem
            icon="cog-outline"
            label="Configurações"
            onPress={() => Alert.alert("Em breve", "Funcionalidade em desenvolvimento")}
          />
          
          <View style={styles.divider} />
          
          <ActionItem 
            icon="logout" 
            label="Sair da Conta" 
            color="#FF4081" 
            onPress={confirmarSaida} 
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AgendaFlorescer v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  );
}

function ActionItem({
  icon,
  label,
  color = "#951950",
  onPress,
}: {
  icon: any;
  label: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.85}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
  content: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 24, gap: 24 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#951950",
    fontWeight: "600",
  },
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
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  roleText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
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
  sectionTitle: { 
    color: "#951950", 
    fontSize: 18, 
    fontWeight: "700", 
    marginLeft: 20, 
    marginBottom: 12 
  },
  actionItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    paddingVertical: 14, 
    paddingHorizontal: 24 
  },
  actionLabel: { 
    fontSize: 16, 
    fontWeight: "700", 
    flex: 1 
  },
  divider: {
    height: 1,
    backgroundColor: "#f5c9d6",
    marginVertical: 8,
  },
  footer: {
    alignItems: "center",
    paddingTop: 16,
  },
  footerText: {
    color: "#cba2ae",
    fontSize: 12,
    fontWeight: "500",
  },
});
