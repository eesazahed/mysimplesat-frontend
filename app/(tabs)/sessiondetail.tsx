import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Score from "@/components/ui/Score";
import ThemedText from "@/components/ui/ThemedText";
import { AnswerRow, RootStackParamList } from "@/types";
import { fetchSessionAnswers } from "@/utils/db";
import formatCategory from "@/utils/formatCategory";
import renderLatex from "@/utils/renderLatex";
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

  const getRowBackgroundColor = (answer: AnswerRow) => {
    const isSolved =
      answer.isCorrect && !answer.reasonForGuess && !answer.howToAvoidGuess;
    const isGuessed =
      answer.isCorrect && !!answer.reasonForGuess && !!answer.howToAvoidGuess;
    const isMistake = !answer.isCorrect;

    if (isSolved) return colorScheme === "dark" ? "#0a6d2f" : "#a1d99b";
    if (isGuessed) return colorScheme === "dark" ? "#b58900" : "#fff176";
    if (isMistake) return colorScheme === "dark" ? "#8b0000" : "#f87171";

    return colorScheme === "dark" ? "#333" : "#eee";
  };

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
        <View>
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
              <View
                key={index}
                style={[
                  styles.row,
                  { backgroundColor: getRowBackgroundColor(answer) },
                ]}
              >
                <View style={styles.section}>
                  <ThemedText>
                    <ThemedText style={styles.bold}>Question: </ThemedText>
                    {renderLatex(String(answer.questionText), colorScheme)}
                  </ThemedText>
                </View>
                {answer.rationale && (
                  <View style={styles.section}>
                    <ThemedText>
                      <ThemedText style={styles.bold}>Rationale: </ThemedText>
                      {renderLatex(String(answer.rationale), colorScheme)}
                    </ThemedText>
                  </View>
                )}
                {!answer.isCorrect && (
                  <View style={styles.section}>
                    <ThemedText>
                      {answer.selectedChoiceValue ? (
                        <>
                          <ThemedText style={styles.bold}>
                            Your answer:{" "}
                          </ThemedText>
                          {renderLatex(
                            String(answer.selectedChoiceValue),
                            colorScheme
                          )}
                        </>
                      ) : (
                        <ThemedText style={styles.bold}>
                          You left this unanswered
                        </ThemedText>
                      )}
                    </ThemedText>
                  </View>
                )}
                {answer.reasonForMistake && (
                  <View style={styles.section}>
                    <ThemedText>
                      <ThemedText style={styles.bold}>
                        Reason for Mistake:{" "}
                      </ThemedText>
                      {answer.reasonForMistake}
                    </ThemedText>
                  </View>
                )}
                {answer.howToAvoidMistake && (
                  <View style={styles.section}>
                    <ThemedText>
                      <ThemedText style={styles.bold}>
                        How to Avoid Mistake:{" "}
                      </ThemedText>
                      {answer.howToAvoidMistake}
                    </ThemedText>
                  </View>
                )}
                {answer.reasonForGuess && (
                  <View style={styles.section}>
                    <ThemedText>
                      <ThemedText style={styles.bold}>
                        Reason for Guess:{" "}
                      </ThemedText>
                      {answer.reasonForGuess}
                    </ThemedText>
                  </View>
                )}
                {answer.howToAvoidGuess && (
                  <View style={styles.section}>
                    <ThemedText>
                      <ThemedText style={styles.bold}>
                        How to Avoid Guess:{" "}
                      </ThemedText>
                      {answer.howToAvoidGuess}
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
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
    borderRadius: 8,
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
