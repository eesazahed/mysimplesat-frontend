import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import type { AnswerRow } from "@/types";
import initDB, { fetchAnswers } from "@/utils/db";
import renderLatex from "@/utils/renderLatex";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";

const SUBJECTS = ["math", "rw"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const TYPES = ["solved", "guessed", "mistake"] as const;

const PAGE_SIZE = 20;

const Tracker = () => {
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [subjectFilters, setSubjectFilters] = useState<string[]>([
    "math",
    "rw",
  ]);
  const [difficultyFilters, setDifficultyFilters] = useState<string[]>([
    "easy",
    "medium",
    "hard",
  ]);
  const [typeFilters, setTypeFilters] = useState<string[]>([
    "guessed",
    "mistake",
  ]);

  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      const loadAnswers = async () => {
        try {
          const db = await initDB();
          const data = await fetchAnswers(db);
          setAnswers(data);
        } catch {
          setAnswers([]);
        } finally {
          setLoading(false);
        }
      };
      loadAnswers();
    }, [])
  );

  const toggleFilter = (
    value: string,
    current: string[],
    setter: (val: string[]) => void
  ) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
    setPage(1);
  };

  const filteredAnswers = useMemo(() => {
    if (
      subjectFilters.length === 0 ||
      difficultyFilters.length === 0 ||
      typeFilters.length === 0
    ) {
      return [];
    }

    return answers.filter((row) => {
      if (!subjectFilters.includes(row.subject ?? "")) return false;
      if (!difficultyFilters.includes(row.difficulty ?? "")) return false;

      const matchType = typeFilters.some((filter) => {
        if (filter === "solved") {
          return row.isCorrect && !row.reasonForGuess && !row.howToAvoidGuess;
        }
        if (filter === "guessed") {
          return row.isCorrect && !!row.reasonForGuess && !!row.howToAvoidGuess;
        }
        if (filter === "mistake") {
          return !row.isCorrect;
        }
        return false;
      });

      return matchType;
    });
  }, [answers, subjectFilters, difficultyFilters, typeFilters]);

  const paginatedAnswers = useMemo(() => {
    return filteredAnswers.slice(0, page * PAGE_SIZE);
  }, [filteredAnswers, page]);

  const canLoadMore = paginatedAnswers.length < filteredAnswers.length;

  const renderTagButton = (
    label: string,
    active: boolean,
    onPress: () => void
  ) => {
    let formattedLabel;
    if (label === "rw") {
      formattedLabel = "RW";
    } else {
      formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    }

    return (
      <Button
        key={label}
        title={formattedLabel}
        onPress={onPress}
        style={{ marginRight: 16, marginVertical: 12 }}
        variant={active ? "primary" : "secondary"}
      />
    );
  };

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
          <Header title="Mistake tracker" />
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
          <Header title="Mistake tracker" />
          <ThemedText style={styles.heading}>
            Total: {filteredAnswers.length}
          </ThemedText>
          <ThemedText style={styles.heading}>Filter by Subject</ThemedText>
          <View style={styles.filterRow}>
            {SUBJECTS.map((subj) =>
              renderTagButton(subj, subjectFilters.includes(subj), () =>
                toggleFilter(subj, subjectFilters, setSubjectFilters)
              )
            )}
          </View>
          <ThemedText style={styles.heading}>Filter by Difficulty</ThemedText>
          <View style={styles.filterRow}>
            {DIFFICULTIES.map((diff) =>
              renderTagButton(diff, difficultyFilters.includes(diff), () =>
                toggleFilter(diff, difficultyFilters, setDifficultyFilters)
              )
            )}
          </View>
          <ThemedText style={styles.heading}>Filter by Status</ThemedText>
          <View style={styles.filterRow}>
            {TYPES.map((type) =>
              renderTagButton(type, typeFilters.includes(type), () =>
                toggleFilter(type, typeFilters, setTypeFilters)
              )
            )}
          </View>
          <View style={{ marginTop: 20 }}>
            {paginatedAnswers.map((answer, index) => (
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
          <View style={{ marginTop: 20, marginBottom: 50 }}>
            {canLoadMore ? (
              <Button
                title="Load more"
                onPress={() => setPage((p) => p + 1)}
                variant="primary"
              />
            ) : (
              <ThemedText style={{ textAlign: "center" }}>
                That&apos;s all!
              </ThemedText>
            )}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
};

export default Tracker;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  row: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  heading: {
    marginTop: 16,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
  },
});
