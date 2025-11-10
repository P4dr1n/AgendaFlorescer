"use client";

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAgendamentos } from "../../contexts/AgendamentosContexts";

export default function AgendarScreen() {
  const router = useRouter();
  const { adicionarAgendamento } = useAgendamentos();

  const [servico, setServico] = useState<string | null>(null);
  const [profissional, setProfissional] = useState<string | null>(null);
  const [data, setData] = useState<Date | null>(null);
  const [hora, setHora] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const servicos = [
    "Limpeza de Pele",
    "Massagem Relaxante",
    "Design de Sobrancelha",
    "Hidratação Capilar",
  ];
  const profissionais = ["Juliana", "Carlos", "Fernanda", "Mariana"];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const formatTime = (time: Date | null) => {
    if (!time) return "";
    return time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const confirmar = () => {
    if (servico && profissional && data && hora) {
      const dataFormatada = formatDate(data);
      const horaFormatada = formatTime(hora);

      // Passa objeto SEM id, será gerado no contexto
      adicionarAgendamento({
        servico,
        profissional,
        data: dataFormatada,
        hora: horaFormatada,
      });

      router.back();
    } else {
      alert("⚠️ Preencha todas as opções antes de confirmar o agendamento.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#951950" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Agendamento</Text>
        </View>

        <Text style={styles.label}>Serviço</Text>
        <View style={styles.optionGroup}>
          {servicos.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, servico === item && styles.optionSelected]}
              onPress={() => setServico(item)}
            >
              <Text
                style={[styles.optionText, servico === item && styles.optionTextSelected]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Profissional</Text>
        <View style={styles.optionGroup}>
          {profissionais.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionBtn, profissional === item && styles.optionSelected]}
              onPress={() => setProfissional(item)}
            >
              <Text
                style={[styles.optionText, profissional === item && styles.optionTextSelected]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity style={styles.inputLike} onPress={() => setShowDatePicker(true)}>
          <MaterialCommunityIcons name="calendar" size={20} color="#951950" />
          <Text style={styles.inputLikeText}>
            {data ? formatDate(data) : "Selecione uma data"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={data || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setData(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity style={styles.inputLike} onPress={() => setShowTimePicker(true)}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#951950" />
          <Text style={styles.inputLikeText}>
            {hora ? formatTime(hora) : "Selecione o horário"}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={hora || new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setHora(selectedTime);
            }}
          />
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={confirmar}>
          <MaterialCommunityIcons name="check-circle" size={22} color="#FFF" />
          <Text style={styles.primaryBtnText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFD3E0",
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#951950",
  },
  label: {
    color: "#951950",
    fontSize: 16,
    fontWeight: "600",
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
  },
  optionSelected: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  optionText: {
    color: "#951950",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#FFF",
  },
  inputLike: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputLikeText: {
    fontSize: 15,
    color: "#2D2D2D",
  },
  primaryBtn: {
    backgroundColor: "#FF4081",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
});
