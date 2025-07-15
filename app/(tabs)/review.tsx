import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import TextArea from "@/components/ui/TextArea";
import ThemedText from "@/components/ui/ThemedText";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

import type { RootStackParamList } from "@/types";
import initDB, { saveAnswers } from "@/utils/db";
import renderLatex from "@/utils/renderLatex";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedQuestions, setGuessedQuestions] = useState<
    Record<string, GuessState>
  >({});
  const [incorrectQuestions, setIncorrectQuestions] = useState<
    Record<string, IncorrectState>
  >({});
  const [guessStep, setGuessStep] = useState(0);
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [incorrectStep, setIncorrectStep] = useState(0);
  const [incorrectSubmitted, setIncorrectSubmitted] = useState(false);
  const [inputReason, setInputReason] = useState("");
  const [inputAvoid, setInputAvoid] = useState("");

  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setGuessedQuestions({});
      setIncorrectQuestions({});
      setGuessStep(0);
      setGuessSubmitted(false);
      setIncorrectStep(0);
      setIncorrectSubmitted(false);
      setInputReason("");
      setInputAvoid("");

      return () => {
        setCurrentIndex(0);
        setGuessedQuestions({});
        setIncorrectQuestions({});
        setGuessStep(0);
        setGuessSubmitted(false);
        setIncorrectStep(0);
        setIncorrectSubmitted(false);
        setInputReason("");
        setInputAvoid("");
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

  if (!isValidUserAnswers || !userAnswers || userAnswers.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Nothing to Review" />
          <ThemedText>No answers available to review.</ThemedText>
        </Container>
      </ScrollView>
    );
  }

  const currentAnswer = userAnswers[currentIndex];
  if (!currentAnswer) {
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
          reasonForGuess: guessedQuestions[answer.questionId].reasonForGuess,
          howToAvoidGuess: guessedQuestions[answer.questionId].howToAvoidGuess,
        };
      } else if (!answer.isCorrect && incorrectQuestions[answer.questionId]) {
        return {
          ...base,
          reasonForMistake:
            incorrectQuestions[answer.questionId].reasonForMistake,
          howToAvoidMistake:
            incorrectQuestions[answer.questionId].howToAvoidMistake,
        };
      }
      return base;
    });

    const saveData = async () => {
      const db = await initDB();
      await saveAnswers(db, combinedAnswers);
    };

    saveData();

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Review Complete" />
          <ThemedText>All questions reviewed.</ThemedText>
        </Container>
      </ScrollView>
    );
  }

  const isCorrect = currentAnswer.isCorrect;

  const handleSolved = () => {
    resetAllStates();
    setCurrentIndex(currentIndex + 1);
  };

  const handleGuessNextStep = () => {
    if (guessStep === 1) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForGuess: inputReason,
          howToAvoidGuess:
            guessedQuestions[currentAnswer.questionId]?.howToAvoidGuess || "",
        },
      }));
      setInputReason("");
      setGuessStep(2);
    } else if (guessStep === 2) {
      setGuessedQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForGuess:
            guessedQuestions[currentAnswer.questionId]?.reasonForGuess || "",
          howToAvoidGuess: inputAvoid,
        },
      }));
      setInputAvoid("");
      setGuessSubmitted(true);
    }
  };

  const handleGuessContinue = () => {
    resetAllStates();
    setCurrentIndex(currentIndex + 1);
  };

  const handleIncorrectNextStep = () => {
    if (incorrectStep === 0) {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForMistake: inputReason,
          howToAvoidMistake:
            incorrectQuestions[currentAnswer.questionId]?.howToAvoidMistake ||
            "",
        },
      }));
      setInputReason("");
      setIncorrectStep(1);
    } else if (incorrectStep === 1) {
      setIncorrectQuestions((prev) => ({
        ...prev,
        [currentAnswer.questionId]: {
          reasonForMistake:
            incorrectQuestions[currentAnswer.questionId]?.reasonForMistake ||
            "",
          howToAvoidMistake: inputAvoid,
        },
      }));
      setInputAvoid("");
      setIncorrectSubmitted(true);
    }
  };

  const handleIncorrectContinue = () => {
    resetAllStates();
    setCurrentIndex(currentIndex + 1);
  };

  const resetAllStates = () => {
    setGuessStep(0);
    setGuessSubmitted(false);
    setIncorrectStep(0);
    setIncorrectSubmitted(false);
    setInputReason("");
    setInputAvoid("");
  };

  const handleSkipReason = () => {
    setInputReason("Skipped");
    if (isCorrect) {
      if (guessStep === 1) {
        setGuessedQuestions((prev) => ({
          ...prev,
          [currentAnswer.questionId]: {
            reasonForGuess: "Skipped",
            howToAvoidGuess: "Skipped",
          },
        }));
        setGuessSubmitted(true);
      } else {
        setGuessSubmitted(true);
      }
    } else {
      if (incorrectStep === 0) {
        setIncorrectQuestions((prev) => ({
          ...prev,
          [currentAnswer.questionId]: {
            reasonForMistake: "Skipped",
            howToAvoidMistake: "Skipped",
          },
        }));
        setIncorrectSubmitted(true);
      } else {
        setIncorrectSubmitted(true);
      }
    }
  };

  const handleSkipAvoid = () => {
    setInputAvoid("Skipped");
    if (isCorrect) {
      if (guessStep === 2) {
        setGuessedQuestions((prev) => ({
          ...prev,
          [currentAnswer.questionId]: {
            ...prev[currentAnswer.questionId],
            howToAvoidGuess: "Skipped",
          },
        }));
        setGuessSubmitted(true);
      }
    } else {
      if (incorrectStep === 1) {
        setIncorrectQuestions((prev) => ({
          ...prev,
          [currentAnswer.questionId]: {
            ...prev[currentAnswer.questionId],
            howToAvoidMistake: "Skipped",
          },
        }));
        setIncorrectSubmitted(true);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header
          title={`Review (${currentIndex + 1} / ${userAnswers.length})`}
        />

        <View style={{ marginBottom: 20 }}>
          <ThemedText
            style={{ marginBottom: 8 }}
            key={`question-${currentIndex}`}
          >
            Question: {renderLatex(currentAnswer.questionText, colorScheme)}
          </ThemedText>
          <ThemedText
            style={{ marginBottom: 24 }}
            key={`rationale-${currentIndex}`}
          >
            Rationale: {renderLatex(currentAnswer.rationale, colorScheme)}
          </ThemedText>
          {isCorrect ? (
            <>
              <ThemedText
                style={{ color: "green", marginTop: 16, marginBottom: 32 }}
              >
                You answered this question correctly.
              </ThemedText>

              {guessStep === 0 && !guessSubmitted && (
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <Button title="I solved it" onPress={handleSolved} />
                  <Button
                    title="I guessed it"
                    onPress={() => setGuessStep(1)}
                  />
                </View>
              )}
              {guessStep === 1 && !guessSubmitted && (
                <>
                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    Why did you guess this question?
                  </ThemedText>
                  <TextArea
                    value={inputReason}
                    onChangeText={setInputReason}
                    placeholder="Explain your thought process"
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipReason}
                    style={{ backgroundColor: "gray", marginTop: 8 }}
                  />
                  <Button
                    title="Submit"
                    onPress={handleGuessNextStep}
                    disabled={inputReason.trim() === ""}
                    style={{ marginTop: 12 }}
                  />
                </>
              )}

              {guessStep === 2 && !guessSubmitted && (
                <>
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
                    title="Skip"
                    onPress={handleSkipAvoid}
                    style={{ backgroundColor: "gray", marginTop: 8 }}
                  />
                  <Button
                    title="Submit"
                    onPress={handleGuessNextStep}
                    disabled={inputAvoid.trim() === ""}
                    style={{ marginTop: 12 }}
                  />
                </>
              )}
              {guessSubmitted && (
                <Button
                  title="Next Question"
                  onPress={handleGuessContinue}
                  style={{ marginTop: 20 }}
                />
              )}
            </>
          ) : (
            <>
              <ThemedText style={{ color: "red", marginVertical: 16 }}>
                {currentAnswer.selectedChoiceValue ? (
                  <>
                    You answered: {currentAnswer.selectedChoiceValue}, which was
                    incorrect
                  </>
                ) : (
                  "You left this unanswered"
                )}
              </ThemedText>

              {incorrectStep === 0 && !incorrectSubmitted && (
                <>
                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    Reason for mistake:
                  </ThemedText>
                  <TextArea
                    value={inputReason}
                    onChangeText={setInputReason}
                    placeholder="Explain why you made this mistake..."
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipReason}
                    style={{ backgroundColor: "gray", marginTop: 8 }}
                  />
                  <Button
                    title="Submit"
                    onPress={handleIncorrectNextStep}
                    disabled={inputReason.trim() === ""}
                    style={{ marginTop: 20 }}
                  />
                </>
              )}

              {incorrectStep === 1 && !incorrectSubmitted && (
                <>
                  <ThemedText style={{ marginTop: 20, marginBottom: 8 }}>
                    How to avoid this mistake in the future:
                  </ThemedText>
                  <TextArea
                    value={inputAvoid}
                    onChangeText={setInputAvoid}
                    placeholder="Your ideas to avoid this mistake..."
                  />
                  <Button
                    title="Skip"
                    onPress={handleSkipAvoid}
                    style={{ backgroundColor: "gray", marginTop: 8 }}
                  />
                  <Button
                    title="Submit"
                    onPress={handleIncorrectNextStep}
                    disabled={inputAvoid.trim() === ""}
                    style={{ marginTop: 20 }}
                  />
                </>
              )}

              {incorrectSubmitted && (
                <Button
                  title="Next Question"
                  onPress={handleIncorrectContinue}
                  style={{ marginTop: 20 }}
                />
              )}
            </>
          )}
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150, paddingHorizontal: 16 },
});

export default Review;
