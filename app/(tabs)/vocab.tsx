import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { VocabQuestion } from "@/types";
import askAI from "@/utils/askAI";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const Vocab = () => {
  const colorScheme = useColorScheme();

  const [currentVocabQuestion, setCurrectVocabQuestion] =
    useState<VocabQuestion | null>(null);
  const [showCorrect, setShowCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const generateVocabWords = async () => {
    setShowCorrect(false);
    setLoading(true);

    try {
      const raw: any = await askAI(
        `Generate a very difficult SAT vocabulary question. Format the response as a JSON object with the following structure:
          
          {
            "question": "A complete SAT-style question with a blank",
            "options": [
              { "label": "A", "word": "exampleWord1", "definition": "5-word brief definition" },
              { "label": "B", "word": "exampleWord2", "definition": "5-word brief definition" },
              { "label": "C", "word": "exampleWord3", "definition": "5-word brief definition" },
              { "label": "D", "word": "exampleWord4", "definition": "5-word brief definition" }
            ],
            "correct": "A"
          }
  
          Make sure the question is challenging and the vocabulary words are advanced. Be unique and creative each time. Create different contexts. For fill in the blanks, just use a string of 10 underscores. Use only valid JSON. No commentary or explanation. Make sure to be VERY careful not to include any form of markdown, such as three backticks`
      );

      const response: VocabQuestion =
        typeof raw === "string" ? JSON.parse(raw) : raw;
      setCurrectVocabQuestion(response);
    } catch {
      setCurrectVocabQuestion({
        question: "Failed to load question. Try again.",
        options: [],
        correct: "A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="Vocab" />

        <ThemedText
          style={{
            marginBottom: 32,
            fontStyle: "italic",
            textAlign: "center",
            color: colorScheme === "dark" ? "#bbb" : "#888",
          }}
        >
          Endless AI generated vocab questions!
        </ThemedText>

        {!!currentVocabQuestion && (
          <View>
            <ThemedText>
              {loading ? "Loading..." : currentVocabQuestion.question}
            </ThemedText>
            <View style={{ marginVertical: 32 }}>
              {currentVocabQuestion.options.map((option, index) => {
                const isCorrect = option.label === currentVocabQuestion.correct;
                let bgColor;

                if (colorScheme === "dark") {
                  if (showCorrect) {
                    if (isCorrect) {
                      bgColor = "darkgreen";
                    } else {
                      bgColor = "darkred";
                    }
                  } else {
                    bgColor = "#323232";
                  }
                } else {
                  if (showCorrect) {
                    if (isCorrect) {
                      bgColor = "lightgreen";
                    } else {
                      bgColor = "#f29d9d";
                    }
                  } else {
                    bgColor = "transparent";
                  }
                }

                const optionButtonStyle = [
                  styles.optionButton,
                  {
                    backgroundColor: bgColor,
                    borderColor: colorScheme === "dark" ? "#323232" : "#ccc",
                  },
                ];

                return (
                  <View key={index} style={styles.optionContainer}>
                    <TouchableOpacity
                      onPress={() => setShowCorrect(true)}
                      style={optionButtonStyle}
                    >
                      {loading ? (
                        <ThemedText>Loading...</ThemedText>
                      ) : (
                        <ThemedText>
                          {option.word}{" "}
                          {showCorrect && `(${option.definition})`}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Button title="Continue" onPress={generateVocabWords} />
      </Container>
    </ScrollView>
  );
};

export default Vocab;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
});
