import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { useInTest } from "@/context/InTestContext";
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type ParsedQuestion = {
  id: string;
  question_text: string;
  subject: Subject;
  difficulty: Difficulty;
  options: { id: string; text: string }[];
  correct_choice: string;
  rationale: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Questions = () => {
  const route = useRoute<RouteProp<RootStackParamList, "questions">>();
  const navigation = useNavigation<NavigationProp>();
  const { setInTest } = useInTest();

  const [rawQuestions, setRawQuestions] = useState<any[] | null>(null);
  const colorScheme = useColorScheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useFocusEffect(
    useCallback(() => {
      setInTest(true);

      const questionsFromParams = route.params?.questions ?? null;
      const timerMinutes = route.params?.timer ?? 0;

      if (questionsFromParams) {
        setRawQuestions(questionsFromParams);
        setCurrentQuestionIndex(0);
        setAnswers({});
      }

      if (timerMinutes && timerMinutes > 0) {
        setSecondsLeft(timerMinutes * 60);
      } else {
        setSecondsLeft(null);
      }

      return () => {
        setRawQuestions(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
        if (timerInterval.current !== null) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
        }
        setSecondsLeft(null);
      };
    }, [route.params?.questions, route.params?.timer, setInTest])
  );

  const autoSubmit = useCallback(() => {
    if (!rawQuestions) return;

    const allAnswers: UserAnswer[] = rawQuestions.map((q) => {
      const selectedChoiceId = answers[q.id] ?? null;
      const isAnswered = typeof selectedChoiceId === "string";

      let selectedOptionText: string | null = null;
      if (isAnswered) {
        try {
          const parsedChoices =
            typeof q.choices === "string" ? JSON.parse(q.choices) : q.choices;
          selectedOptionText = parsedChoices[selectedChoiceId] ?? null;
        } catch {
          selectedOptionText = null;
        }
      }

      return {
        questionId: q.id,
        questionText: q.question_text,
        subject: q.subject,
        difficulty: q.difficulty,
        selectedChoiceValue: selectedOptionText,
        isCorrect: isAnswered ? selectedChoiceId === q.correct_choice : false,
        rationale: q.rationale,
      };
    });

    navigation.navigate("review", { userAnswers: allAnswers });

    if (timerInterval.current !== null) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, [rawQuestions, answers, navigation]);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft === 0) {
      autoSubmit();
      return;
    }

    timerInterval.current = setInterval(() => {
      setSecondsLeft((sec) => (sec !== null ? sec - 1 : null));
    }, 1000);

    return () => {
      if (timerInterval.current !== null) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [secondsLeft, autoSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const questions: ParsedQuestion[] = useMemo(() => {
    if (!rawQuestions) return [];

    try {
      return rawQuestions.map((q) => {
        const parsedChoices =
          typeof q.choices === "string" ? JSON.parse(q.choices) : q.choices;
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
          correct_choice: q.correct_choice,
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
        <ThemedText style={{ textAlign: "center" }}>
          No valid questions available
        </ThemedText>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
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
    autoSubmit();
  };

  const selectedOptionStyle = {
    borderColor: "#007AFF",
    backgroundColor: colorScheme === "dark" ? "#003366" : "#cce5ff",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header
          title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        />
        {secondsLeft !== null && (
          <ThemedText
            style={{
              marginBottom: 48,
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Time Remaining: {formatTime(secondsLeft)}
          </ThemedText>
        )}

        <ThemedText
          style={{ marginBottom: 24 }}
          key={`question-${currentQuestionIndex}`}
        >
          {renderLatex(currentQuestion.question_text, colorScheme)}
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
                  {renderLatex(option.text, colorScheme)}
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
    borderRadius: 12,
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
