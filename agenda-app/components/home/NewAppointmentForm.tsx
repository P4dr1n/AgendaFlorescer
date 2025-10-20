import { memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ServicoResponse } from "@/lib/api";

interface NewAppointmentFormProps {
  loadingServicos: boolean;
  servicos: ServicoResponse[];
  selectedServicoId: string;
  onSelectServico: (id: string) => void;
  dataInput: string;
  onChangeData: (value: string) => void;
  horaInput: string;
  onChangeHora: (value: string) => void;
  formError: string | null;
  creatingAgendamento: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

function NewAppointmentFormComponent({
  loadingServicos,
  servicos,
  selectedServicoId,
  onSelectServico,
  dataInput,
  onChangeData,
  horaInput,
  onChangeHora,
  formError,
  creatingAgendamento,
  onSubmit,
  onCancel,
}: NewAppointmentFormProps) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Novo agendamento</Text>

      <View>
        <Text style={styles.formLabel}>Serviço</Text>
        <View style={styles.serviceChips}>
          {loadingServicos ? (
            <ActivityIndicator color="#FF4081" />
          ) : servicos.length > 0 ? (
            servicos.map((servico) => {
              const selected = servico.id === selectedServicoId;
              return (
                <TouchableOpacity
                  key={servico.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onSelectServico(servico.id)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {servico.nome}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.formHelper}>Nenhum serviço cadastrado ainda.</Text>
          )}
        </View>
      </View>

      <View>
        <Text style={styles.formLabel}>Data (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.formInput}
          placeholder="2025-10-30"
          placeholderTextColor="rgba(140, 49, 85, 0.45)"
          value={dataInput}
          onChangeText={onChangeData}
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View>
        <Text style={styles.formLabel}>Hora (HH:mm)</Text>
        <TextInput
          style={styles.formInput}
          placeholder="14:30"
          placeholderTextColor="rgba(140, 49, 85, 0.45)"
          value={horaInput}
          onChangeText={onChangeHora}
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={5}
        />
      </View>

      {formError ? <Text style={styles.formFeedback}>{formError}</Text> : null}

      <View style={styles.formButtons}>
        <TouchableOpacity
          style={[styles.formButton, creatingAgendamento && styles.formButtonDisabled]}
          onPress={onSubmit}
          disabled={creatingAgendamento}
          activeOpacity={0.85}
        >
          <Text style={styles.formButtonText}>
            {creatingAgendamento ? "Agendando..." : "Confirmar agendamento"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formButtonSecondary}
          onPress={onCancel}
          disabled={creatingAgendamento}
          activeOpacity={0.85}
        >
          <Text style={styles.formButtonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const NewAppointmentForm = memo(NewAppointmentFormComponent);

const styles = StyleSheet.create({
  formCard: {
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
  formTitle: {
    color: "#8c3155",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  formLabel: {
    color: "#8c3155",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  serviceChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#F48FB1",
    backgroundColor: "#FFFFFF",
  },
  chipSelected: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  chipText: {
    color: "#FF4081",
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  formHelper: {
    color: "#8c3155",
    fontSize: 14,
  },
  formInput: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(244, 143, 177, 0.6)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#8c3155",
  },
  formButtons: {
    gap: 12,
  },
  formButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  formButtonDisabled: {
    opacity: 0.7,
  },
  formButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  formButtonSecondary: {
    backgroundColor: "transparent",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(244, 143, 177, 0.7)",
  },
  formButtonSecondaryText: {
    color: "#FF4081",
    fontSize: 16,
    fontWeight: "700",
  },
  formFeedback: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "600",
  },
});
