import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import MathJax from "react-native-mathjax-svg";

const LINE_HEIGHT = 30;

const renderLatex = (
  text: string,
  colorScheme: string | null | undefined
): ReactNode[] => {
  if (!text) return [];

  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const math = part.slice(1, -1);
      return (
        <View
          key={index}
          style={{
            height: 20,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ translateY: 7 }],
          }}
        >
          <MathJax color={colorScheme === "dark" ? "white" : "black"}>
            {math}
          </MathJax>
        </View>
      );
    }

    return (
      <Text
        key={index}
        style={{
          lineHeight: LINE_HEIGHT,
          fontSize: 16,
        }}
      >
        {part}
      </Text>
    );
  });
};

export default renderLatex;
