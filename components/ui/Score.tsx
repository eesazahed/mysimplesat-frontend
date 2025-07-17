import ThemedText from "@/components/ui/ThemedText";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  correct: number;
  total: number;
  colorScheme: "light" | "dark" | null | undefined;
}

const Score = ({ correct, total, colorScheme }: Props) => {
  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <View style={styles.scoreContainer}>
        <ThemedText style={styles.score}>Score:</ThemedText>
        <ThemedText style={styles.score}>
          {correct} / {total}{" "}
          <Text
            style={[
              styles.percent,
              { color: colorScheme === "dark" ? "#bbb" : "#888" },
            ]}
          >
            {" "}
            ({total === 0 ? 0 : Math.round((correct / total) * 100)}%){" "}
          </Text>
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  score: {
    fontSize: 24,
    fontFamily: "LatoBold",
  },
  percent: {
    fontSize: 12,
    fontWeight: "normal",
  },
});

export default Score;
