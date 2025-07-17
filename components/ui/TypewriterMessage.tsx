import ThemedText from "@/components/ui/ThemedText";
import renderLatex from "@/utils/renderLatex";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface Props {
  content: string;
  delay?: number;
}

const TypewriterMessage = ({ content, delay = 50 }: Props) => {
  const [typedContent, setTypedContent] = useState("");

  useEffect(() => {
    const words = content.split(" ");
    let index = 0;
    let currentText = "";

    setTypedContent("");

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        return;
      }
      currentText += (index === 0 ? "" : " ") + words[index];
      setTypedContent(currentText);
      index++;
    }, delay);

    return () => clearInterval(interval);
  }, [content, delay]);

  return (
    <ThemedText style={styles.aiMessageText}>
      {renderLatex(typedContent, "dark")}
    </ThemedText>
  );
};

export default TypewriterMessage;

const styles = StyleSheet.create({
  aiMessageText: {
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    backgroundColor: "green",
    color: "white",
  },
});
