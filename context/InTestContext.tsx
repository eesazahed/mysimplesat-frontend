import React, { createContext, useContext, useState } from "react";

type InTestContextType = {
  inTest: boolean;
  setInTest: (value: boolean) => void;
};

const InTestContext = createContext<InTestContextType | undefined>(undefined);

export const InTestProvider = ({ children }: { children: React.ReactNode }) => {
  const [inTest, setInTest] = useState(false);

  return (
    <InTestContext.Provider value={{ inTest, setInTest }}>
      {children}
    </InTestContext.Provider>
  );
};

export const useInTest = (): InTestContextType => {
  const context = useContext(InTestContext);
  if (!context) {
    throw new Error("useInTest must be used within InTestProvider");
  }
  return context;
};
