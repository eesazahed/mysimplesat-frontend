import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import type { AnswerRow, RootStackParamList } from "@/types";
import copyToClipboard from "@/utils/copyToClipboard";
import renderLatex from "@/utils/renderLatex";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  answer: AnswerRow;
  showTime?: boolean;
};

const AnswerCard = ({ answer, showTime = false }: Props) => {
  const colorScheme = useColorScheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isSolved =
    answer.isCorrect && !answer.reasonForGuess && !answer.howToAvoidGuess;
  const isGuessed =
    answer.isCorrect && !!answer.reasonForGuess && !!answer.howToAvoidGuess;
  const isMistake = !answer.isCorrect;

  const backgroundColor = isSolved
    ? colorScheme === "dark"
      ? "#0a6d2f"
      : "#a1d99b"
    : isGuessed
    ? colorScheme === "dark"
      ? "#b58900"
      : "#fff176"
    : isMistake
    ? colorScheme === "dark"
      ? "#8b0000"
      : "#f87171"
    : colorScheme === "dark"
    ? "#333"
    : "#eee";

  return (
    <View style={[styles.row, { backgroundColor }]}>
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
                <ThemedText style={styles.bold}>Your answer: </ThemedText>
                {renderLatex(String(answer.selectedChoiceValue), colorScheme)}
              </>
            ) : (
              <ThemedText style={styles.bold}>
                You left this unanswered
              </ThemedText>
            )}
          </ThemedText>
        </View>
      )}

      {answer.reasonForMistake && answer.reasonForMistake !== "Skipped" && (
        <View style={styles.section}>
          <ThemedText>
            <ThemedText style={styles.bold}>Reason for Mistake: </ThemedText>
            {answer.reasonForMistake}
          </ThemedText>
        </View>
      )}

      {answer.howToAvoidMistake && answer.howToAvoidMistake !== "Skipped" && (
        <View style={styles.section}>
          <ThemedText>
            <ThemedText style={styles.bold}>How to Avoid Mistake: </ThemedText>
            {answer.howToAvoidMistake}
          </ThemedText>
        </View>
      )}

      {answer.reasonForGuess && answer.reasonForGuess !== "Skipped" && (
        <View style={styles.section}>
          <ThemedText>
            <ThemedText style={styles.bold}>Reason for Guess: </ThemedText>
            {answer.reasonForGuess}
          </ThemedText>
        </View>
      )}

      {answer.howToAvoidGuess && answer.howToAvoidGuess !== "Skipped" && (
        <View style={styles.section}>
          <ThemedText>
            <ThemedText style={styles.bold}>How to Avoid Guess: </ThemedText>
            {answer.howToAvoidGuess}
          </ThemedText>
        </View>
      )}

      {answer.updatedAt && showTime && (
        <View style={{ marginTop: 12, alignItems: "flex-end" }}>
          <ThemedText style={{ fontSize: 12 }}>
            {new Date(answer.updatedAt).toLocaleString(undefined, {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </ThemedText>
        </View>
      )}

      <View style={{ flexDirection: "row", marginTop: 32 }}>
        <View style={{ width: "50%", padding: 8 }}>
          <Button
            style={{ borderWidth: 0 }}
            onPress={() => navigation.navigate("chat", { userAnswer: answer })}
            title="AI Tutor"
          />
        </View>
        <View style={{ width: "50%", padding: 8 }}>
          <Button
            style={{ borderWidth: 0, backgroundColor: "gray" }}
            onPress={() => copyToClipboard(answer)}
            title="Copy details"
          />
        </View>
      </View>
    </View>
  );
};

export default AnswerCard;

const styles = StyleSheet.create({
  row: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  section: {
    marginBottom: 12,
  },
  bold: {
    fontWeight: "bold",
  },
});
