import AIExplanation from "@/components/ui/AIExplanation";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import TextArea from "@/components/ui/TextArea";
import ThemedText from "@/components/ui/ThemedText";
import { useInTest } from "@/context/InTestContext";
import type { RootStackParamList } from "@/types";
import askAI from "@/utils/askAI";
import { saveAnswers } from "@/utils/db";
import renderLatex from "@/utils/renderLatex";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

type GuessState = {
  reasonForGuess: string;
  howToAvoidGuess: string;
};

type IncorrectState = {
  reasonForMistake: string;
  howToAvoidMistake: string;
};

const Review = () => {
  const route = useRoute<RouteProp<RootStackParamList, "review">>();
  const userAnswers = route.params?.userAnswers;
  const { setInTest } = useInTest();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedQuestions, setGuessedQuestions] = useState<
    Record<string, GuessState>
  >({});
  const [incorrectQuestions, setIncorrectQuestions] = useState<
    Record<string, IncorrectState>
  >({});
  const [guessStep, setGuessStep] = useState(0);
  const [incorrectStep, setIncorrectStep] = useState(0);
  const [inputReason, setInputReason] = useState("");
  const [inputAvoid, setInputAvoid] = useState("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const colorScheme = useColorScheme();
  const currentAnswer = userAnswers?.[currentIndex];
  const isCorrect = currentAnswer?.isCorrect ?? false;

  useFocusEffect(
    useCallback(() => {
      resetAllStates();
      setCurrentIndex(0);
      return () => {
        resetAllStates();
        setCurrentIndex(0);
      };
    }, [])
  );

  const isValidUserAnswers =
    Array.isArray(userAnswers) &&
    userAnswers.every(
      (a) =>
        typeof a === "object" &&
        a !== null &&
        typeof a.questionId === "string" &&
        typeof a.isCorrect === "boolean"
    );

  useEffect(() => {
    if (!currentAnswer && userAnswers && userAnswers.length > 0) {
      const saveData = async () => {
        const combinedAnswers = userAnswers.map((answer) => {
          const base = {
            ...answer,
            reasonForGuess: null,
            howToAvoidGuess: null,
            reasonForMistake: null,
            howToAvoidMistake: null,
          };

          if (answer.isCorrect && guessedQuestions[answer.questionId]) {
            return {
              ...base,
              reasonForGuess:
                guessedQuestions[answer.questionId]?.reasonForGuess,
              howToAvoidGuess:
                guessedQuestions[answer.questionId]?.howToAvoidGuess,
            };
          } else if (
            !answer.isCorrect &&
            incorrectQuestions[answer.questionId]
          ) {
            return {
              ...base,
              reasonForMistake:
                incorrectQuestions[answer.questionId]?.reasonForMistake,
              howToAvoidMistake:
                incorrectQuestions[answer.questionId]?.howToAvoidMistake,
            };
          }

          return base;
        });

        await saveAnswers(combinedAnswers);
      };

      setInTest(false);
      saveData();
    }
  }, [
    currentAnswer,
    userAnswers,
    guessedQuestions,
    incorrectQuestions,
    setInTest,
  ]);

  const correctCount = userAnswers?.filter((a) => a.isCorrect).length ?? 0;
  const score = correctCount;
  const percentage = userAnswers
    ? Math.round((correctCount / userAnswers.length) * 100)
    : 0;

  const handleSolved = () => {
    resetAllStates();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleGuessNextStep = async () => {
    if (!currentAnswer) return;

    if (guessStep === 1) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForGuess: inputReason,
          howToAvoidGuess:
            prev[currentAnswer.questionId]?.howToAvoidGuess ?? "",
        },
      }));

      setInputReason("");
      setGuessStep(2);
      setIsLoadingAI(true);

      const prompt = `A student guessed the answer to the following question and gave this reason:\n\n"${inputReason}"\n\nExplain why this reasoning might lead them to the correct answer.`;
      const explanation = await askAI(prompt);

      setAiExplanation(explanation || "No explanation available.");
      setIsLoadingAI(false);
    } else if (guessStep === 2) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForGuess: prev[currentAnswer.questionId]?.reasonForGuess ?? "",
          howToAvoidGuess: inputAvoid,
        },
      }));

      setInputAvoid("");
      handleGuessContinue();
    }
  };

  const handleGuessContinue = () => {
    resetAllStates();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleIncorrectNextStep = async () => {
    if (!currentAnswer) return;

    if (incorrectStep === 0) {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForMistake: inputReason,
          howToAvoidMistake:
            prev[currentAnswer.questionId]?.howToAvoidMistake ?? "",
        },
      }));

      setInputReason("");
      setIncorrectStep(1);
      setIsLoadingAI(true);

      const prompt = `A student selected the incorrect answer "${currentAnswer.selectedChoiceValue}" for the following question:\n\n"${currentAnswer.questionText}"\n\nThe rationale for the correct answer is:\n\n"${currentAnswer.rationale}"\n\nThe student gave this reason for their mistake:\n\n"${inputReason}"\n\nBased on this, explain why the student might have made this mistake.`;
      const explanation = await askAI(prompt);

      setAiExplanation(explanation || "No explanation available.");
      setIsLoadingAI(false);
    } else if (incorrectStep === 1) {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForMistake:
            prev[currentAnswer.questionId]?.reasonForMistake ?? "",
          howToAvoidMistake: inputAvoid,
        },
      }));

      setInputAvoid("");
      handleIncorrectContinue();
    }
  };

  const handleIncorrectContinue = () => {
    resetAllStates();
    setCurrentIndex((prev) => prev + 1);
  };

  const resetAllStates = () => {
    setGuessStep(0);
    setIncorrectStep(0);
    setInputReason("");
    setInputAvoid("");
    setAiExplanation(null);
    setIsLoadingAI(false);
  };

  const handleSkipReason = () => {
    if (!currentAnswer) return;

    setInputReason("Skipped");

    if (isCorrect) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForGuess: "Skipped",
          howToAvoidGuess: "Skipped",
        },
      }));
      handleGuessContinue();
    } else {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForMistake: "Skipped",
          howToAvoidMistake: "Skipped",
        },
      }));
      handleIncorrectContinue();
    }
  };

  const handleSkipAvoid = () => {
    if (!currentAnswer) return;

    setInputAvoid("Skipped");

    if (isCorrect) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          ...prev[currentAnswer.questionId],
          howToAvoidGuess: "Skipped",
        },
      }));
      handleGuessContinue();
    } else {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          ...prev[currentAnswer.questionId],
          howToAvoidMistake: "Skipped",
        },
      }));
      handleIncorrectContinue();
    }
  };

  if (!isValidUserAnswers || !userAnswers || userAnswers.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Nothing to Review" />
          <ThemedText style={{ textAlign: "center" }}>
            No answers available to review
          </ThemedText>
        </Container>
      </ScrollView>
    );
  }

  if (!currentAnswer) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Review Complete" />
          <ThemedText style={{ textAlign: "center" }}>
            All questions reviewed
          </ThemedText>
        </Container>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header
          title={`Review (${currentIndex + 1} / ${userAnswers.length})`}
        />
        <ThemedText
          style={{
            marginBottom: 48,
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Score: {score}/{userAnswers.length} ({percentage}%)
        </ThemedText>

        <View style={{ marginBottom: 20 }}>
          <ThemedText style={{ marginBottom: 8 }}>
            Question: {renderLatex(currentAnswer.questionText, colorScheme)}
          </ThemedText>
          <ThemedText style={{ marginBottom: 24 }}>
            Rationale: {renderLatex(currentAnswer.rationale, colorScheme)}
          </ThemedText>

          {isCorrect ? (
            <>
              <ThemedText style={{ color: "green", marginBottom: 32 }}>
                You answered this question correctly.
              </ThemedText>

              {guessStep === 0 && (
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <Button title="I solved it" onPress={handleSolved} />
                  <Button
                    title="I guessed it"
                    onPress={() => setGuessStep(1)}
                  />
                </View>
              )}

              {guessStep === 1 && (
                <>
                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    Why did you guess this question?
                  </ThemedText>
                  <TextArea
                    value={inputReason}
                    onChangeText={setInputReason}
                    placeholder="Explain your process"
                  />
                  <Button
                    title="Submit"
                    onPress={handleGuessNextStep}
                    disabled={inputReason.trim() === ""}
                    style={{ marginTop: 8 }}
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipReason}
                    style={{ backgroundColor: "#6B7280", marginTop: 12 }}
                  />
                </>
              )}

              {guessStep === 2 && (
                <>
                  <AIExplanation
                    isLoading={isLoadingAI}
                    explanation={aiExplanation}
                    colorScheme={colorScheme}
                  />

                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    How can you avoid guessing questions like this in the
                    future?
                  </ThemedText>
                  <TextArea
                    value={inputAvoid}
                    onChangeText={setInputAvoid}
                    placeholder="Strategies to avoid guessing..."
                  />
                  <Button
                    title="Submit"
                    onPress={handleGuessNextStep}
                    disabled={inputAvoid.trim() === ""}
                    style={{ marginTop: 8 }}
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipAvoid}
                    style={{ backgroundColor: "#6B7280", marginTop: 12 }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <ThemedText
                style={{ color: "red", marginVertical: 16, marginBottom: 24 }}
              >
                {currentAnswer.selectedChoiceValue ? (
                  <>
                    You answered: {currentAnswer.selectedChoiceValue}, which was
                    incorrect.
                  </>
                ) : (
                  <>You did not select an answer.</>
                )}
              </ThemedText>

              {incorrectStep === 0 && (
                <>
                  <ThemedText style={{ marginBottom: 8 }}>
                    Why did you make this mistake?
                  </ThemedText>
                  <TextArea
                    value={inputReason}
                    onChangeText={setInputReason}
                    placeholder="Explain your mistake"
                  />
                  <Button
                    title="Submit"
                    onPress={handleIncorrectNextStep}
                    disabled={inputReason.trim() === ""}
                    style={{ marginBottom: 8 }}
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipReason}
                    style={{ backgroundColor: "#6B7280" }}
                  />
                </>
              )}

              {incorrectStep === 1 && (
                <>
                  <AIExplanation
                    isLoading={isLoadingAI}
                    explanation={aiExplanation}
                    colorScheme={colorScheme}
                  />

                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    How can you avoid this mistake in the future?
                  </ThemedText>
                  <TextArea
                    value={inputAvoid}
                    onChangeText={setInputAvoid}
                    placeholder="Strategies to avoid this mistake"
                  />
                  <Button
                    title="Submit"
                    onPress={handleIncorrectNextStep}
                    disabled={inputAvoid.trim() === ""}
                    style={{ marginBottom: 8 }}
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipAvoid}
                    style={{ backgroundColor: "#6B7280" }}
                  />
                </>
              )}
            </>
          )}
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
});

export default Review;
