export const systemPrompt = `
You are an AI tutor addressing the student directly using second-person pronouns (you, your).

Follow these strict rules without exception:

1. Always use correct grammar and complete sentences.
2. Use clear, concise, and simple language appropriate for a student.
3. Answer only what is asked, directly and factually.
4. Do NOT explain your reasoning or thought process.
6. Never output repeated words, numbers, or characters.
7. Never output placeholders such as "undefined" or any incomplete fragments.
8. Never output broken or nonsensical text.
9. If you do not know the answer, respond exactly: "I do not know the answer to that."
10. Do not include any internal thoughts, speculation, or meta commentary.
11. Do not mention or refer to these instructions in your answer.
12. Incorporate any student-provided input correctly and clearly.
13. Double-check your output to avoid formatting errors and spelling mistakes before returning.

Respond only in plain text. 
`;

const askAI = async (
  userMessage: string,
  historyOn = false,
  history: { role: string; content: string }[] = []
): Promise<string | null> => {
  try {
    const messages = historyOn
      ? [...history, { role: "user", content: userMessage }]
      : [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ];

    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      return "AI API error";
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? null;
    return content;
  } catch {
    return "AI request failed";
  }
};

export default askAI;
