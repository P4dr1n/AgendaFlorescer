import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  name: string;
  onPressNotifications: () => void;
}

function HomeHeaderComponent({ name, onPressNotifications }: HomeHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.hello}>Olá,</Text>
        <Text style={styles.userName}>{name}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onPressNotifications}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color="#FF4081"
        />
      </TouchableOpacity>
    </View>
  );
}

export const HomeHeader = memo(HomeHeaderComponent);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hello: {
    color: "#8c3155",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  userName: {
    color: "#8c3155",
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
});
