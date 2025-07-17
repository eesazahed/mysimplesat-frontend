import { AnswerRow } from "@/types";
import * as Clipboard from "expo-clipboard";

const copyToClipboard = (answer: AnswerRow) => {
  const answerData = `Subject: ${answer.subject}
Difficulty: ${answer.difficulty}
Question: ${answer.questionText}
Rationale: ${answer.rationale}
User answer: ${answer.selectedChoiceValue}

${
  answer.reasonForGuess && answer.reasonForGuess !== "Skipped"
    ? `Reason for guess: "${answer.reasonForGuess}"\n`
    : ""
}${
    answer.howToAvoidGuess && answer.howToAvoidGuess !== "Skipped"
      ? `To avoid guessing: "${answer.howToAvoidGuess}"\n`
      : ""
  }${
    answer.reasonForMistake && answer.reasonForMistake !== "Skipped"
      ? `Reason for mistake: "${answer.reasonForMistake}"\n`
      : ""
  }${
    answer.howToAvoidMistake && answer.howToAvoidMistake !== "Skipped"
      ? `To avoid mistake: "${answer.howToAvoidMistake}"`
      : ""
  }`;

  Clipboard.setStringAsync(answerData);
};

export default copyToClipboard;
