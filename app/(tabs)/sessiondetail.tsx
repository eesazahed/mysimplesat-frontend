import AnswerCard from "@/components/ui/AnswerCard";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Score from "@/components/ui/Score";
import ThemedText from "@/components/ui/ThemedText";
import { AnswerRow, RootStackParamList } from "@/types";
import { fetchSessionAnswers } from "@/utils/db";
import formatCategory from "@/utils/formatCategory";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";

const SessionDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, "sessiondetail">>();
  const session = route.params.session;

  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadAnswers = async () => {
      setLoading(true);
      try {
        const data = await fetchSessionAnswers(session.id);
        setAnswers(data);
      } catch {
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };
    loadAnswers();
  }, [session.id]);

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Session Details" />
          <ThemedText style={{ textAlign: "center", marginTop: 100 }}>
            Loading...
          </ThemedText>
        </Container>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="Test Details" />
        <ThemedText style={styles.stats}>Session ID: {session.id}</ThemedText>
        <ThemedText style={styles.stats}>
          Subject: {formatCategory(session.subject)}
        </ThemedText>
        <ThemedText style={styles.stats}>
          Difficulty: {formatCategory(session.difficulty)}
        </ThemedText>
        <ThemedText style={styles.stats}>
          Time:{" "}
          {new Date(session.createdAt).toLocaleString(undefined, {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </ThemedText>

        <Score
          colorScheme={colorScheme}
          correct={session.correct}
          total={session.total}
        />

        <View style={{ marginTop: 20 }}>
          {answers.map((answer, index) => (
            <AnswerCard key={index} answer={answer} />
          ))}
        </View>
      </Container>
    </ScrollView>
  );
};

export default SessionDetail;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  row: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  stats: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
  },
});
