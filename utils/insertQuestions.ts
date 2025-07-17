import questions from "@/assets/sat_question_bank.json";
import * as SQLite from "expo-sqlite";

const insertQuestions = async () => {
  const db = await SQLite.openDatabaseAsync("app_db");

  const [{ count }] = await db.getAllAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM questions`
  );

  if (count > 0) return;

  await db.execAsync("BEGIN TRANSACTION");

  try {
    for (const q of questions) {
      await db.runAsync(
        `INSERT OR IGNORE INTO questions (
          id,
          subject,
          difficulty,
          question_text,
          choices,
          correct_choice,
          rationale
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.subject,
          q.difficulty,
          q.question_text,
          JSON.stringify(q.choices),
          q.correct_choice,
          q.rationale,
        ]
      );
    }
    await db.execAsync("COMMIT");
  } catch (error) {
    await db.execAsync("ROLLBACK");
    throw error;
  }
};

export default insertQuestions;
