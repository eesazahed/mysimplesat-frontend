import { AnswerRow } from "@/types";

const feedbackPrompt = (userAnswer: AnswerRow) => {
  return `Here is an SAT ${
    userAnswer.subject
  } question, with the difficulty being ${userAnswer.difficulty}: "${
    userAnswer.questionText
  }"

The rationale is "${userAnswer.rationale}"

The user selected "${userAnswer.selectedChoiceValue}" as their answer.

    ${
      userAnswer.reasonForGuess &&
      userAnswer.reasonForGuess !== "Skipped" &&
      userAnswer.howToAvoidGuess &&
      userAnswer.reasonForGuess !== "Skipped"
        ? `The user guessed, with the reason being "${userAnswer.reasonForGuess}" and to avoid guessing like this in the future the users plan is "${userAnswer.howToAvoidGuess}"`
        : ""
    }
    ${
      userAnswer.reasonForMistake &&
      userAnswer.reasonForMistake !== "Skipped" &&
      userAnswer.howToAvoidMistake &&
      userAnswer.howToAvoidMistake !== "Skipped"
        ? `The user made a mistake, with the reason being "${userAnswer.reasonForMistake}" and to avoid making a mistake like this in the future the users plan is "${userAnswer.howToAvoidMistake}"`
        : ""
    }

Provide some feedback and tips for the user.`;
};

export default feedbackPrompt;
