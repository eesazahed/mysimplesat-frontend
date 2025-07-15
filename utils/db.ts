import { AnswerRow } from "@/types";
import type { SQLiteDatabase } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import insertQuestions from "./insertQuestions";

const initDB = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync("mistake_tracker");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId TEXT UNIQUE,
      questionText TEXT,
      subject TEXT,
      difficulty TEXT,
      isCorrect INTEGER,
      selectedChoiceValue TEXT,
      rationale TEXT,
      reasonForMistake TEXT,
      howToAvoidMistake TEXT,
      reasonForGuess TEXT,
      howToAvoidGuess TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      subject TEXT,
      difficulty TEXT,
      question_text TEXT,
      choices TEXT,
      correct_choice TEXT,
      rationale TEXT
    );
  `);

  await insertQuestions(db);
  return db;
};

const saveAnswers = async (
  db: SQLiteDatabase,
  combinedAnswers: AnswerRow[]
): Promise<void> => {
  for (const answer of combinedAnswers) {
    await db.runAsync(
      `INSERT INTO answers (
        questionId,
        questionText,
        subject,
        difficulty,
        isCorrect,
        selectedChoiceValue,
        rationale,
        reasonForMistake,
        howToAvoidMistake,
        reasonForGuess,
        howToAvoidGuess
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(questionId) DO UPDATE SET
        questionText=excluded.questionText,
        subject=excluded.subject,
        difficulty=excluded.difficulty,
        isCorrect=excluded.isCorrect,
        selectedChoiceValue=excluded.selectedChoiceValue,
        rationale=excluded.rationale,
        reasonForMistake=excluded.reasonForMistake,
        howToAvoidMistake=excluded.howToAvoidMistake,
        reasonForGuess=excluded.reasonForGuess,
        howToAvoidGuess=excluded.howToAvoidGuess;
      `,
      [
        answer.questionId,
        answer.questionText ?? null,
        answer.subject,
        answer.difficulty,
        answer.isCorrect ? 1 : 0,
        answer.selectedChoiceValue,
        answer.rationale ?? null,
        answer.reasonForMistake ?? null,
        answer.howToAvoidMistake ?? null,
        answer.reasonForGuess ?? null,
        answer.howToAvoidGuess ?? null,
      ]
    );
  }
};

const fetchQuestionsFromDB = async (
  db: SQLiteDatabase,
  subject: string,
  difficulty: string,
  count: number
) => {
  const rows = await db.getAllAsync<any>(
    `SELECT q.*
     FROM questions q
     LEFT JOIN answers a ON q.id = a.questionId
     WHERE q.subject = ?
       AND q.difficulty = ?
       AND (
         a.isCorrect IS NULL
         OR a.isCorrect = 0
         OR (a.isCorrect = 1 AND a.reasonForGuess IS NOT NULL AND a.howToAvoidGuess IS NOT NULL)
       )
     ORDER BY RANDOM()
     LIMIT ?`,
    [subject, difficulty, count]
  );

  return rows.map((row) => ({
    id: row.id,
    question_text: row.question_text,
    subject: row.subject,
    difficulty: row.difficulty,
    choices: JSON.parse(row.choices),
    correct_choice: row.correct_choice,
    rationale: row.rationale,
  }));
};

const fetchAnswers = async (db: SQLiteDatabase): Promise<AnswerRow[]> => {
  const rows = await db.getAllAsync<any>(`SELECT * FROM answers;`);
  return rows.map((row) => ({
    questionId: row.questionId,
    questionText: row.questionText,
    subject: row.subject,
    difficulty: row.difficulty,
    isCorrect: row.isCorrect === 1,
    selectedChoiceValue: row.selectedChoiceValue,
    rationale: row.rationale,
    reasonForMistake: row.reasonForMistake,
    howToAvoidMistake: row.howToAvoidMistake,
    reasonForGuess: row.reasonForGuess,
    howToAvoidGuess: row.howToAvoidGuess,
  }));
};

const deleteDatabase = async () => {
  try {
    await SQLite.deleteDatabaseAsync("mistake_tracker");
    console.log(`Database mistake_tracker deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete database mistake_tracker:`, error);
  }
};

export default initDB;
export { deleteDatabase, fetchAnswers, fetchQuestionsFromDB, saveAnswers };
