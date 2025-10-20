import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AgendamentoResponse } from "@/lib/api";

interface UpcomingAppointmentsListProps {
  appointments: AgendamentoResponse[];
  formatDate: (isoDate: string) => string;
}

function UpcomingAppointmentsListComponent({
  appointments,
  formatDate,
}: UpcomingAppointmentsListProps) {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <View style={styles.listCard}>
      <Text style={styles.listTitle}>Outros agendamentos</Text>
      {appointments.map((agendamento) => (
        <View key={agendamento.id} style={styles.listItem}>
          <View style={styles.listItemIcon}>
            <MaterialCommunityIcons name="calendar" size={20} color="#FF4081" />
          </View>
          <View style={styles.listItemContent}>
            <Text style={styles.listItemTitle}>{agendamento.servico.nome}</Text>
            <Text style={styles.listItemSubtitle}>{formatDate(agendamento.data)}</Text>
          </View>
          <Text style={styles.listItemStatus}>{agendamento.status}</Text>
        </View>
      ))}
    </View>
  );
}

export const UpcomingAppointmentsList = memo(UpcomingAppointmentsListComponent);

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    gap: 14,
    shadowColor: "#8c3155",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  listTitle: {
    color: "#8c3155",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  listItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemContent: {
    flex: 1,
    gap: 2,
  },
  listItemTitle: {
    color: "#8c3155",
    fontSize: 15,
    fontWeight: "700",
  },
  listItemSubtitle: {
    color: "#6E6E6E",
    fontSize: 13,
    fontWeight: "500",
  },
  listItemStatus: {
    color: "#FF4081",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
