import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickItemConfig {
  icon: any;
  label: string;
  onPress: () => void;
}

interface QuickAccessGridProps {
  title: string;
  items: QuickItemConfig[];
}

function QuickAccessGridComponent({ title, items }: QuickAccessGridProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.quickGrid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickItem}
            onPress={item.onPress}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconWrap}>
              <MaterialCommunityIcons name={item.icon} size={26} color="#FF4081" />
            </View>
            <Text style={styles.quickLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export const QuickAccessGrid = memo(QuickAccessGridComponent);

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#8c3155",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 8,
    marginBottom: -4,
    textTransform: "capitalize",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
  },
  quickItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 12,
    alignItems: "center",
    shadowColor: "#8c3155",
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
    backgroundColor: "#FCE4EC",
  },
  quickLabel: {
    color: "#8c3155",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
});
