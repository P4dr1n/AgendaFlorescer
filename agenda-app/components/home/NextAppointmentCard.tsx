import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AgendamentoResponse } from "@/lib/api";

interface NextAppointmentCardProps {
  loading: boolean;
  appointment: AgendamentoResponse | null;
  formatDate: (isoDate: string) => string;
}

function NextAppointmentCardComponent({
  loading,
  appointment,
  formatDate,
}: NextAppointmentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={24}
            color="#FF4081"
          />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>
            {appointment ? "Próximo agendamento" : "Nenhum agendamento"}
          </Text>
          <Text style={styles.cardSubtitle}>
            {appointment
              ? "Confira os detalhes do seu próximo compromisso."
              : "Agende um horário para ver os detalhes aqui."}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color="#FF4081" />
        </View>
      ) : appointment ? (
        <>
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="spa" size={18} color="#8c3155" />
              <Text style={styles.detailLabel}>Serviço</Text>
            </View>
            <Text style={styles.detailValue}>{appointment.servico.nome}</Text>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={18}
                color="#8c3155"
              />
              <Text style={styles.detailLabel}>Status</Text>
            </View>
            <Text style={styles.detailValue}>{appointment.status}</Text>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color="#8c3155"
              />
              <Text style={styles.detailLabel}>Data e hora</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(appointment.data)}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Você ainda não possui agendamentos.</Text>
      )}
    </View>
  );
}

export const NextAppointmentCard = memo(NextAppointmentCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: "#8c3155",
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
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: "#8c3155",
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: -0.3,
    textTransform: "capitalize",
  },
  cardSubtitle: {
    color: "#c9b2ba",
    fontSize: 14,
    fontWeight: "500",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#FCE4EC",
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
    color: "#8c3155",
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
  loadingWrapper: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#8c3155",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
