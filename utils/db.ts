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
      isCorrect INTEGER,
      selectedChoiceValue TEXT,
      rationale TEXT,
      reasonForMistake TEXT,
      howToAvoidMistake TEXT
    );
  `);

  console.log("Initialized DB");

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
        isCorrect,
        selectedChoiceValue,
        rationale,
        reasonForMistake,
        howToAvoidMistake
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        answer.questionId,
        answer.questionText ?? null,
        answer.isCorrect ? 1 : 0,
        answer.selectedChoiceValue,
        answer.rationale ?? null,
        answer.reasonForMistake ?? null,
        answer.howToAvoidMistake ?? null,
      ]
    );
  }
};

const fetchAnswers = async (db: SQLiteDatabase): Promise<AnswerRow[]> => {
  const rows = await db.getAllAsync<AnswerRow>(`SELECT * FROM answers;`);
  return rows;
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
