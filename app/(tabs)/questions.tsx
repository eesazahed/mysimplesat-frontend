import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import type {
  Difficulty,
  RootStackParamList,
  Subject,
  UserAnswer,
} from "@/types";
import renderLatex from "@/utils/renderLatex";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import "react-native-get-random-values";

type ParsedQuestion = {
  id: string;
  question_text: string;
  subject: Subject;
  difficulty: Difficulty;
  options: { id: string; text: string }[];
  correctChoiceId: string;
  rationale: string;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "questions"
>;

const Questions = () => {
  const route = useRoute<RouteProp<RootStackParamList, "questions">>();
  const navigation = useNavigation<NavigationProp>();

  const [rawQuestions, setRawQuestions] = useState<any[] | null>(null);

  const colorScheme = useColorScheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  useFocusEffect(
    useCallback(() => {
      const questionsFromParams = route.params?.questions ?? null;

      if (questionsFromParams) {
        setRawQuestions(questionsFromParams);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setUserAnswers([]);
      }

      return () => {
        setRawQuestions(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setUserAnswers([]);
      };
    }, [route.params?.questions])
  );

  const questions: ParsedQuestion[] = useMemo(() => {
    if (!rawQuestions) return [];

    try {
      return rawQuestions.map((q) => {
        const parsedChoices = JSON.parse(q.choices);
        const options = Object.entries(parsedChoices).map(([id, text]) => ({
          id,
          text: text as string,
        }));
        return {
          id: q.id,
          question_text: q.question_text,
          subject: q.subject,
          difficulty: q.difficulty,
          options,
          correctChoiceId: q.correct_choice,
          rationale: q.rationale,
        };
      });
    } catch (err) {
      console.error("Invalid question format", err);
      setRawQuestions(null);
      return [];
    }
  }, [rawQuestions]);

  if (!rawQuestions || questions.length === 0) {
    return (
      <Container>
        <Header title="Questions" />
        <ThemedText>No valid questions available.</ThemedText>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));

    const isCorrect = currentQuestion.correctChoiceId === optionId;
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.id === optionId
    );

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question_text,
      subject: currentQuestion.subject,
      difficulty: currentQuestion.difficulty,
      selectedChoiceValue: selectedOption?.text || "",
      isCorrect,
      rationale: currentQuestion.rationale,
    };

    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (ua) => ua.questionId === currentQuestion.id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  };

  const goNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const onSubmit = () => {
    navigation.navigate("review", { userAnswers });
  };

  const selectedOptionStyle = {
    borderColor: "#007AFF",
    backgroundColor: colorScheme === "dark" ? "#003366" : "#cce5ff",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View>
          <Header
            title={`Question ${currentQuestionIndex + 1} of ${
              questions.length
            }`}
          />
          <ThemedText
            style={{ marginBottom: 24 }}
            key={`question-${currentQuestionIndex}`}
          >
            {renderLatex(currentQuestion.question_text)}
          </ThemedText>

          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === option.id;

            const optionButtonStyle = [
              styles.optionButton,
              {
                backgroundColor:
                  colorScheme === "dark" ? "#323232" : "transparent",
                borderColor: colorScheme === "dark" ? "#323232" : "#ccc",
              },
              isSelected && selectedOptionStyle,
            ];

            return (
              <View key={option.id} style={styles.optionContainer}>
                <TouchableOpacity
                  onPress={() => selectOption(option.id)}
                  style={optionButtonStyle}
                >
                  <ThemedText
                    style={styles.optionText}
                    key={`option-${currentQuestionIndex}-${index}`}
                  >
                    {renderLatex(option.text)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={styles.navigationButtons}>
            <Button
              title="Back"
              onPress={goBack}
              disabled={currentQuestionIndex === 0}
            />
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                title="Next"
                onPress={goNext}
                disabled={!answers[currentQuestion.id]}
              />
            ) : (
              <Button
                title="Submit"
                onPress={onSubmit}
                disabled={!answers[currentQuestion.id]}
              />
            )}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
};

export default Questions;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
