import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { RootStackParamList } from "@/types";
import { fetchQuestionsFromDB } from "@/utils/db";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const subjects = [
  { label: "Math", value: "math" },
  { label: "RW", value: "rw" },
];

const difficulties = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const questionCounts = [5, 10, 15, 20];

const timers = [
  { label: "60", value: 60 },
  { label: "30", value: 30 },
  { label: "15", value: 15 },
  { label: "None", value: 0 },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Test = () => {
  const navigation = useNavigation<NavigationProp>();

  const [subject, setSubject] = useState<string>("math");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [count, setCount] = useState<number>(5);
  const [timer, setTimer] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const canStart = subject && difficulty && count;

  const fetchQuestions = async () => {
    if (!canStart) return;

    setLoading(true);
    try {
      const data = await fetchQuestionsFromDB(subject, difficulty, count);

      if (!Array.isArray(data)) throw new Error("Invalid question data");

      navigation.navigate("questions", { questions: data, timer });
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderButtonGroup = <T extends string | number>(
    options: { label: string; value: T }[],
    selected: T | null,
    onSelect: (val: T) => void
  ) => (
    <View style={styles.buttonGroup}>
      {options.map(({ label, value }) => (
        <Button
          key={value.toString()}
          title={label}
          onPress={() => onSelect(value)}
          variant={selected === value ? "primary" : "secondary"}
          style={styles.buttonMargin}
        />
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View>
          <Header title="Take a test" />

          <View style={{ marginBottom: 16 }}>
            <ThemedText>Select Subject</ThemedText>
            {renderButtonGroup(subjects, subject, setSubject)}

            <ThemedText>Select Difficulty</ThemedText>
            {renderButtonGroup(difficulties, difficulty, setDifficulty)}

            <ThemedText>Select Number of Questions</ThemedText>
            {renderButtonGroup(
              questionCounts.map((v) => ({ label: v.toString(), value: v })),
              count,
              setCount
            )}

            <ThemedText>Select Time Limit (minutes)</ThemedText>
            {renderButtonGroup(timers, timer, setTimer)}

            <ThemedText
              style={{ marginVertical: 16, color: "red", fontStyle: "italic" }}
            >
              Once you start a test, exiting will reset all progress. Make sure
              you&apos;re ready and focused.
            </ThemedText>
          </View>

          <Button
            title={loading ? "Loading..." : "Ready to start?"}
            onPress={fetchQuestions}
            disabled={!canStart || loading}
          />
        </View>
      </Container>
    </ScrollView>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
  selectedButton: { backgroundColor: "#007AFF" },
  buttonGroup: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  buttonMargin: { marginRight: 16, marginVertical: 12 },
});
