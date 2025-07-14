import React, { ReactNode } from "react";
import { InlineMath } from "react-katex";

const renderLatex = (text: string): ReactNode[] => {
  if (text) {
    const parts = text.split(/(\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1);
        return <InlineMath key={index}>{math}</InlineMath>;
      }
      return <span key={index}>{part}</span>;
    });
  } else {
    return [];
  }
};

export default renderLatex;
