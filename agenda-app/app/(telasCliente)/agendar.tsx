// agenda-app/app/(telasCliente)/agendar.tsx

import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../services/api";

interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
}

interface Profissional {
  id: string;
  nome: string;
  especialidade?: string;
}

export default function AgendarScreen() {
  const router = useRouter();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (dataSelecionada && servicoSelecionado) {
      carregarHorariosDisponiveis();
    } else {
      setHorariosDisponiveis([]);
      setHoraSelecionada(null);
    }
  }, [dataSelecionada, servicoSelecionado]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [servicosRes, profissionaisRes] = await Promise.all([
        api.get("/api/servicos"),
        api.get("/api/profissionais"),
      ]);
      setServicos(servicosRes.data);
      setProfissionais(profissionaisRes.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const carregarHorariosDisponiveis = async () => {
    if (!dataSelecionada || !servicoSelecionado) return;

    try {
      setLoadingHorarios(true);
      setHoraSelecionada(null);

      const ano = dataSelecionada.getFullYear();
      const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
      const dia = String(dataSelecionada.getDate()).padStart(2, '0');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      
      const response = await api.get(
        `/api/agendamentos/horarios-disponiveis?data=${dataFormatada}&servicoId=${servicoSelecionado.id}`
      );
      
      setHorariosDisponiveis(response.data);
      
      if (response.data.length === 0) {
        Alert.alert("Aviso", "Não há horários disponíveis para esta data");
      }
    } catch (error: any) {
      Alert.alert("Aviso", error.response?.data?.message || "Erro ao buscar horários");
      setHorariosDisponiveis([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada || !horaSelecionada) {
      Alert.alert("Atenção", "Preencha todas as informações");
      return;
    }

    try {
      setLoading(true);

      const [hora, minuto] = horaSelecionada.split(":");
      const dataHora = new Date(dataSelecionada);
      dataHora.setHours(parseInt(hora), parseInt(minuto), 0, 0);

      await api.post("/api/agendamentos", {
        servicoId: servicoSelecionado.id,
        profissionalId: profissionalSelecionado.id,
        data: dataHora.toISOString(),
      });

      Alert.alert("Sucesso!", "Agendamento criado com sucesso", [
        { 
          text: "OK", 
          onPress: () => {
            // ✅ MUDANÇA AQUI: Usa replace ao invés de back
            router.replace("/(telasCliente)/home");
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível criar o agendamento");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: Date | null) => {
    if (!data) return "";
    return data.toLocaleDateString("pt-BR");
  };

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  if (loading && servicos.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#951950" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Agendamento</Text>
        </View>

        <Text style={styles.label}>Serviço</Text>
        {servicos.length === 0 ? (
          <Text style={styles.avisoText}>Nenhum serviço disponível</Text>
        ) : (
          <View style={styles.optionGroup}>
            {servicos.map((servico) => (
              <TouchableOpacity
                key={servico.id}
                style={[
                  styles.optionBtn,
                  servicoSelecionado?.id === servico.id && styles.optionSelected,
                ]}
                onPress={() => setServicoSelecionado(servico)}
              >
                <Text style={[
                  styles.optionText,
                  servicoSelecionado?.id === servico.id && styles.optionTextSelected,
                ]}>
                  {servico.nome}
                </Text>
                <Text style={[
                  styles.optionSubtext,
                  servicoSelecionado?.id === servico.id && styles.optionSubtextSelected,
                ]}>
                  {formatarPreco(servico.preco)} • {servico.duracao} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Profissional</Text>
        {profissionais.length === 0 ? (
          <Text style={styles.avisoText}>Nenhum profissional disponível</Text>
        ) : (
          <View style={styles.optionGroup}>
            {profissionais.map((prof) => (
              <TouchableOpacity
                key={prof.id}
                style={[
                  styles.optionBtn,
                  profissionalSelecionado?.id === prof.id && styles.optionSelected,
                ]}
                onPress={() => setProfissionalSelecionado(prof)}
              >
                <Text style={[
                  styles.optionText,
                  profissionalSelecionado?.id === prof.id && styles.optionTextSelected,
                ]}>
                  {prof.nome}
                </Text>
                {prof.especialidade && (
                  <Text style={[
                    styles.optionSubtext,
                    profissionalSelecionado?.id === prof.id && styles.optionSubtextSelected,
                  ]}>
                    {prof.especialidade}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity style={styles.inputLike} onPress={() => setShowDatePicker(true)}>
          <MaterialCommunityIcons name="calendar" size={20} color="#951950" />
          <Text style={styles.inputLikeText}>
            {dataSelecionada ? formatarData(dataSelecionada) : "Selecione uma data"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dataSelecionada || new Date()}
            mode="date"
            minimumDate={new Date()}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDataSelecionada(selectedDate);
            }}
          />
        )}

        {dataSelecionada && servicoSelecionado && (
          <>
            <Text style={styles.label}>Horários Disponíveis</Text>
            {loadingHorarios ? (
              <ActivityIndicator size="small" color="#FF4081" style={{ marginVertical: 10 }} />
            ) : horariosDisponiveis.length > 0 ? (
              <View style={styles.horariosGrid}>
                {horariosDisponiveis.map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      styles.horarioBtn,
                      horaSelecionada === horario && styles.horarioSelected,
                    ]}
                    onPress={() => setHoraSelecionada(horario)}
                  >
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={horaSelecionada === horario ? "#FFF" : "#951950"}
                    />
                    <Text style={[
                      styles.horarioText,
                      horaSelecionada === horario && styles.horarioTextSelected,
                    ]}>
                      {horario}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.avisoText}>Nenhum horário disponível</Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada || !horaSelecionada) &&
              styles.primaryBtnDisabled,
          ]}
          onPress={confirmarAgendamento}
          disabled={loading || !servicoSelecionado || !profissionalSelecionado || !dataSelecionada || !horaSelecionada}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle" size={22} color="#FFF" />
              <Text style={styles.primaryBtnText}>Confirmar Agendamento</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFD3E0" },
  content: { padding: 24, gap: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#951950", fontWeight: "600" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#951950" },
  label: { color: "#951950", fontSize: 16, fontWeight: "600", marginTop: 8 },
  optionGroup: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
    minWidth: "48%",
  },
  optionSelected: { backgroundColor: "#FF4081", borderColor: "#FF4081" },
  optionText: { color: "#951950", fontWeight: "600", fontSize: 15 },
  optionTextSelected: { color: "#FFF" },
  optionSubtext: { fontSize: 12, color: "#951950", marginTop: 4, opacity: 0.7 },
  optionSubtextSelected: { color: "#FFF", opacity: 1 },
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
  inputLikeText: { fontSize: 15, color: "#2D2D2D" },
  horariosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  horarioBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#f5c9d6",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  horarioSelected: { backgroundColor: "#FF4081", borderColor: "#FF4081" },
  horarioText: { color: "#951950", fontWeight: "600", fontSize: 14 },
  horarioTextSelected: { color: "#FFF" },
  avisoText: {
    textAlign: "center",
    color: "#951950",
    fontSize: 14,
    fontStyle: "italic",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
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
  primaryBtnDisabled: { backgroundColor: "#CCC" },
  primaryBtnText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
});
