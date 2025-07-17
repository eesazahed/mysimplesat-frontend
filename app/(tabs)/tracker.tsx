import AnswerCard from "@/components/ui/AnswerCard";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import type { AnswerRow } from "@/types";
import { fetchAnswers } from "@/utils/db";
import formatCategory from "@/utils/formatCategory";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

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

  useFocusEffect(
    useCallback(() => {
      const loadAnswers = async () => {
        try {
          const data = await fetchAnswers();
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
    return (
      <Button
        key={label}
        title={formatCategory(label)}
        onPress={onPress}
        style={{ marginRight: 16, marginVertical: 12 }}
        variant={active ? "primary" : "secondary"}
      />
    );
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
            <AnswerCard key={index} answer={answer} showTime />
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
      </Container>
    </ScrollView>
  );
};

export default Tracker;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  row: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
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
