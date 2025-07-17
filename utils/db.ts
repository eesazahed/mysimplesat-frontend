import { AnswerRow, Notes } from "@/types";
import type { SQLiteDatabase } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import insertQuestions from "./insertQuestions";

let dbInstance: SQLiteDatabase | null = null;

const getDB = async (): Promise<SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("app_db", {
      useNewConnection: true,
    });
  }
  return dbInstance;
};

const initDB = async (): Promise<SQLiteDatabase> => {
  const db = await getDB();

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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      textContent TEXT DEFAULT '1 + 1 = 2'
    );
  `);

  await insertQuestions();
  return db;
};

const saveAnswers = async (combinedAnswers: AnswerRow[]): Promise<void> => {
  try {
    const timestamp = new Date().toISOString();

    const db = await getDB();
    await db.runAsync(`INSERT INTO sessions (createdAt) VALUES (?)`, [
      timestamp,
    ]);
    const rows = await db.getAllAsync<{ id: number }>(
      `SELECT last_insert_rowid() AS id;`
    );
    const sessionId = rows[0].id;

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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
  const db = await getDB();

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
  const db = await getDB();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM answers ORDER BY updatedAt DESC;`
  );

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

const fetchSessionStats = async () => {
  const db = await getDB();

  const rows = await db.getAllAsync<any>(
    `SELECT 
       s.id, 
       s.createdAt,
       (SELECT subject FROM answers WHERE sessionId = s.id LIMIT 1) AS subject,
       (SELECT difficulty FROM answers WHERE sessionId = s.id LIMIT 1) AS difficulty,
       SUM(CASE WHEN a.isCorrect = 1 THEN 1 ELSE 0 END) AS correct, 
       COUNT(*) AS total 
     FROM sessions s
     JOIN answers a ON s.id = a.sessionId
     GROUP BY s.id
     ORDER BY s.createdAt DESC`
  );

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    subject: row.subject,
    difficulty: row.difficulty,
    correct: row.correct,
    total: row.total,
  }));
};

const fetchSessionAnswers = async (sessionId: number) => {
  const db = await getDB();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM answers WHERE sessionId = ? ORDER BY updatedAt DESC;`,
    [sessionId]
  );

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

const saveNotes = async (textContent: string) => {
  const db = await getDB();

  await db.runAsync(
    `INSERT OR REPLACE INTO notes (id, textContent) VALUES (?, ?)`,
    [1, textContent]
  );
};

const fetchNotes = async (): Promise<Notes> => {
  const db = await getDB();

  const notes = await db.getAllAsync<any>(`SELECT * FROM notes LIMIT 1;`);

  return notes[0];
};

const dropTables = async () => {
  try {
    const db = await getDB();
    await db.execAsync(`DROP TABLE IF EXISTS answers;`);
    await db.execAsync(`DROP TABLE IF EXISTS sessions;`);
    await initDB();
    console.log(`Tables answers and sessions dropped successfully.`);
  } catch (error) {
    console.error(`Failed to drop tables answers and sessions:`, error);
  }
};

const deleteDatabase = async () => {
  try {
    await SQLite.deleteDatabaseAsync("app_db");
    console.log(`Database app_db deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete database app_db:`, error);
  }
};

export default initDB;
export {
  deleteDatabase,
  dropTables,
  fetchAnswers,
  fetchNotes,
  fetchQuestionsFromDB,
  fetchSessionAnswers,
  fetchSessionStats,
  saveAnswers,
  saveNotes,
};
