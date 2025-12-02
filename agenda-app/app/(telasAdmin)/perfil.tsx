// agenda-app/app/(telasAdmin)/perfil.tsx

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "../../contexts/UserContext";

export default function PerfilAdminScreen() {
  const router = useRouter();
  const { user, logout } = useUser();

  const confirmarSaida = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
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
      ]
    );
  };

  return (
    <LinearGradient colors={["#FFE5F0", "#FFF0F7", "#FFFFFF"]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Perfil</Text>
          </View>

          {/* Card Principal */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="shield-account" size={48} color="#B23A6D" />
            </View>
            <Text style={styles.userName}>{user?.usuario || "Administrador"}</Text>
            <Text style={styles.userEmail}>{user?.email || "admin@florescer.com"}</Text>
            
            <View style={styles.adminBadge}>
              <MaterialCommunityIcons name="shield-crown" size={16} color="#FFFFFF" />
              <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
            </View>
          </View>

          {/* Seções de Conta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <ActionItem
              icon="account-edit"
              label="Editar Perfil"
              color="#B23A6D"
              onPress={() => Alert.alert("Editar Perfil", "Funcionalidade em desenvolvimento")}
            />
            <ActionItem
              icon="lock-reset"
              label="Alterar Senha"
              color="#D946A6"
              onPress={() => Alert.alert("Alterar Senha", "Entre em contato com o suporte")}
            />
            <ActionItem
              icon="bell"
              label="Notificações"
              color="#E85A8E"
              onPress={() => Alert.alert("Notificações", "Funcionalidade em desenvolvimento")}
            />
          </View>

          {/* Navegação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navegação</Text>
            <ActionItem
              icon="view-dashboard"
              label="Ir para Dashboard"
              color="#FF4081"
              onPress={() => router.push("/(telasAdmin)/dashboard")}
            />
            <ActionItem
              icon="calendar-clock"
              label="Ver Agendamentos"
              color="#B23A6D"
              onPress={() => router.push("/(telasAdmin)/agendamentos")}
            />
            <ActionItem
              icon="account-switch"
              label="Alternar para Cliente"
              color="#D946A6"
              onPress={() => {
                Alert.alert(
                  "Mudar de Área",
                  "Deseja voltar para a área do cliente?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { 
                      text: "Sim, voltar", 
                      onPress: () => router.replace("/(telasCliente)/home") 
                    },
                  ]
                );
              }}
            />
          </View>

          {/* Configurações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <ActionItem
              icon="cog"
              label="Preferências"
              color="#666"
              onPress={() => Alert.alert("Preferências", "Funcionalidade em desenvolvimento")}
            />
            <ActionItem
              icon="help-circle"
              label="Ajuda e Suporte"
              color="#666"
              onPress={() => Alert.alert("Ajuda", "Entre em contato: suporte@florescer.com")}
            />
            <ActionItem
              icon="information"
              label="Sobre o App"
              color="#666"
              onPress={() => Alert.alert("Florescer Admin", "Versão 1.0.0\nSistema de Gestão")}
            />
          </View>

          {/* Sair */}
          <View style={styles.section}>
            <ActionItem
              icon="logout"
              label="Sair da Conta"
              color="#F44336"
              onPress={confirmarSaida}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="flower" size={24} color="#D946A6" />
            <Text style={styles.footerText}>Florescer Admin v1.0.0</Text>
            <Text style={styles.footerSubtext}>Sistema de Gestão Estética</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ActionItem({
  icon,
  label,
  color = "#2D2D2D",
  onPress,
}: {
  icon: any;
  label: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionItemLeft}>
        <View style={[styles.actionItemIcon, { backgroundColor: color + "20" }]}>
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.actionItemLabel}>{label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
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
  header: {
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#B23A6D",
    letterSpacing: -0.5,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE5F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#B23A6D",
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#B23A6D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  adminBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#B23A6D",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  actionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingTop: 24,
    gap: 8,
  },
  footerText: {
    color: "#B23A6D",
    fontSize: 14,
    fontWeight: "700",
  },
  footerSubtext: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
});
