import { AnswerRow } from "@/types";
import type { SQLiteDatabase } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

const initDB = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync("mistake_tracker");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId TEXT,
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
    )
  `);

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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
export { deleteDatabase, fetchAnswers, saveAnswers };
