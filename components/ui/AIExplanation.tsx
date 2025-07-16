import ThemedText from "@/components/ui/ThemedText";
import renderLatex from "@/utils/renderLatex";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  isLoading: boolean;
  explanation: string | null;
  colorScheme: "light" | "dark" | null | undefined;
  delay?: number;
}

const AIExplanation = ({
  isLoading,
  explanation,
  colorScheme,
  delay = 50,
}: Props) => {
  const [typedExplanation, setTypedExplanation] = useState("");

  useEffect(() => {
    if (!explanation) {
      setTypedExplanation("");
      return;
    }

    const words = explanation.split(" ");
    let index = 0;
    setTypedExplanation("");

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        return;
      }
      setTypedExplanation((prev) => (prev ? prev + " " : "") + words[index]);
      index++;
    }, delay);

    return () => clearInterval(interval);
  }, [explanation, delay]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {isLoading ? (
        <ThemedText style={styles.title}>Loading AI reflection...</ThemedText>
      ) : explanation ? (
        <>
          <ThemedText style={styles.title}>AI explanation:</ThemedText>
          <ThemedText style={styles.explanation}>
            &quot;{renderLatex(typedExplanation, colorScheme)}&quot;
          </ThemedText>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: "#323232",
    borderColor: "#323232",
  },
  lightContainer: {
    backgroundColor: "transparent",
    borderColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
    marginVertical: 4,
  },
  explanation: {
    fontStyle: "italic",
    marginVertical: 4,
  },
});

export default AIExplanation;
