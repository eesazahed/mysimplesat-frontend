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
      howToAvoidGuess TEXT,
      updatedAt TEXT DEFAULT (datetime('now')),
      sessionId INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT DEFAULT (datetime('now'))
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

  await insertQuestions();
  return db;
};

const saveAnswers = async (combinedAnswers: AnswerRow[]): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync("mistake_tracker");

    await db.runAsync(
      `INSERT INTO sessions (createdAt) VALUES (datetime('now'))`
    );
    const rows = await db.getAllAsync<{ id: number }>(
      `SELECT last_insert_rowid() AS id;`
    );
    const sessionId = rows[0].id;
    const timestamp = new Date().toISOString();

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
          howToAvoidGuess,
          updatedAt,
          sessionId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          howToAvoidGuess=excluded.howToAvoidGuess,
          updatedAt=excluded.updatedAt,
          sessionId=excluded.sessionId;
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
          timestamp,
          sessionId,
        ]
      );
    }
  } catch (error) {
    console.error("Error inserting answers batch", error);
    throw error;
  }
};

const fetchQuestionsFromDB = async (
  subject: string,
  difficulty: string,
  count: number
) => {
  const db = await SQLite.openDatabaseAsync("mistake_tracker");

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

const fetchAnswers = async (): Promise<AnswerRow[]> => {
  const db = await SQLite.openDatabaseAsync("mistake_tracker");

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
    updatedAt: row.updatedAt,
    sessionId: row.sessionId,
  }));
};

const dropTables = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("mistake_tracker");
    await db.execAsync(`DROP TABLE IF EXISTS answers;`);
    await db.execAsync(`DROP TABLE IF EXISTS sessions;`);
    console.log(`Tables answers and sessions dropped successfully.`);
  } catch (error) {
    console.error(`Failed to drop tables answers and sessions:`, error);
  }
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
export {
  deleteDatabase,
  dropTables,
  fetchAnswers,
  fetchQuestionsFromDB,
  saveAnswers,
};
