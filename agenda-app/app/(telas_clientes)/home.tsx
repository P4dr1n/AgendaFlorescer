"use client";

import { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuthToken } from "@/lib/auth-storage";
import {
  AgendamentoResponse,
  getProfileRequest,
  listAgendamentosRequest,
} from "@/lib/api";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NextAppointmentCard } from "@/components/home/NextAppointmentCard";
import { UpcomingAppointmentsList } from "@/components/home/UpcomingAppointmentsList";
import { ScheduleCtaButton } from "@/components/home/ScheduleCtaButton";
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid";

export default function HomeClienteScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Cliente");
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const sortAgendamentos = (lista: AgendamentoResponse[]) =>
        [...lista].sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );

      const loadUsuarioEAgendamentos = async () => {
        try {
          const token = await getAuthToken();

          if (!active) {
            return;
          }

          if (!token) {
            setUserName("Cliente");
            setAgendamentos([]);
            setLoadingAgendamentos(false);
            return;
          }

          const [profile, agendamentosResponse] = await Promise.all([
            getProfileRequest(token),
            listAgendamentosRequest(token),
          ]);

          if (!active) {
            return;
          }

          if (profile?.nomeCompleto) {
            const firstName = profile.nomeCompleto.trim().split(/\s+/)[0];
            setUserName(firstName || "Cliente");
          } else {
            setUserName("Cliente");
          }

          setAgendamentos(sortAgendamentos(agendamentosResponse));
        } catch (error) {
          console.warn("Falha ao carregar dados do usuário", error);
        } finally {
          if (active) {
            setLoadingAgendamentos(false);
          }
        }
      };

      setLoadingAgendamentos(true);
      loadUsuarioEAgendamentos();

      return () => {
        active = false;
      };
    }, [])
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
      }),
    []
  );

  const proximo = useMemo(
    () => (agendamentos.length > 0 ? agendamentos[0] : null),
    [agendamentos]
  );

  const seguintes = useMemo(
    () => (agendamentos.length > 1 ? agendamentos.slice(1) : []),
    [agendamentos]
  );

  const formatDate = (isoDate: string) => {
    try {
      return dateFormatter.format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  const handleNavigateToSchedule = useCallback(() => {
    router.push("/(telas_clientes)/novo-agendamento");
  }, [router]);

  const quickAccessItems = useMemo(
    () => [
      {
        icon: "calendar-month",
        label: "Agendar horário",
        onPress: handleNavigateToSchedule,
      },
      { icon: "spa", label: "Nossos serviços", onPress: () => { } },
      { icon: "tag", label: "Promoções", onPress: () => { } },
      { icon: "account-circle", label: "Meu perfil", onPress: () => { } },
    ],
    [handleNavigateToSchedule]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name={userName || "Cliente"}
          onPressNotifications={() => { }}
        />

        <NextAppointmentCard
          loading={loadingAgendamentos}
          appointment={proximo}
          formatDate={formatDate}
        />

        <UpcomingAppointmentsList
          appointments={seguintes}
          formatDate={formatDate}
        />

        <ScheduleCtaButton onPress={handleNavigateToSchedule} />

        <QuickAccessGrid title="Acesso rápido" items={quickAccessItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FCE4EC",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 20,
  },
});
