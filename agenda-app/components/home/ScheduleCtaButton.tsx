import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ScheduleCtaButtonProps {
  onPress: () => void;
}

function ScheduleCtaButtonComponent({ onPress }: ScheduleCtaButtonProps) {
  return (
    <TouchableOpacity
      style={styles.primaryCta}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <MaterialCommunityIcons name="calendar-plus" size={24} color="#FFFFFF" />
      <Text style={styles.primaryCtaText}>Agendar novo horário</Text>
    </TouchableOpacity>
  );
}

export const ScheduleCtaButton = memo(ScheduleCtaButtonComponent);

const styles = StyleSheet.create({
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
    textTransform: "capitalize",
  },
});
