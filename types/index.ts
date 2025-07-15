export type Subject = "math" | "rw";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionChoiceKey = "A" | "B" | "C" | "D";

export type QuestionChoices = Record<QuestionChoiceKey, string>;

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  question_text: string;
  choices: string;
  correct_choice: QuestionChoiceKey;
  rationale: string;
}

export interface UserAnswer {
  questionId: string;
  questionText: string;
  subject: Subject;
  difficulty: Difficulty;
  selectedChoiceValue: string | null;
  isCorrect: boolean;
  rationale: string;
  reviewStatus?: "solved" | "guessed" | "incorrect";
  guessReason?: string;
  guessAvoidance?: string;
  mistakeReason?: string;
  mistakeAvoidance?: string;
}

export interface AnswerRow {
  questionId: string;
  questionText?: string | null;
  subject: Subject;
  difficulty: Difficulty;
  isCorrect: boolean;
  selectedChoiceValue: string | null;
  rationale?: string | null;
  reasonForMistake?: string | null;
  howToAvoidMistake?: string | null;
  reasonForGuess?: string | null;
  howToAvoidGuess?: string | null;
  updatedAt?: string | null;
}

export type RootStackParamList = {
  questions: { questions: any[]; timer: number };
  review: { userAnswers: UserAnswer[] };
  test: undefined;
};
