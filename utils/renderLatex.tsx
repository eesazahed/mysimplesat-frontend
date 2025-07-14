import React, { ReactNode } from "react";
import { Text } from "react-native";
import MathJax from "react-native-mathjax-svg";

const renderLatex = (text: string): ReactNode[] => {
  if (!text) return [];

  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      const math = part.slice(1, -1);
      return (
        <MathJax key={index} style={{ transform: [{ translateY: 3 }] }}>
          {math}
        </MathJax>
      );
    }
    return (
      <Text key={index} style={{ fontSize: 16, color: "black" }}>
        {part}
      </Text>
    );
  });
};

export default renderLatex;
