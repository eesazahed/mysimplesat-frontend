import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { dropTables } from "@/utils/db";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const Settings = () => {
  const [buttonText, setButtonText] = useState("Reset mistake tracker");

  const handleDropTables = async () => {
    try {
      setButtonText("Resetting...");
      await dropTables();
      setTimeout(() => {
        setButtonText("Reset mistake tracker");
      }, 1000);
    } catch (error) {
      console.error("Failed to drop answers table", error);
      setButtonText("Reset mistake tracker");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="Settings" />

        <ThemedText
          style={{
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Would you like to reset your mistake tracker?
        </ThemedText>
        <Button
          title={buttonText}
          style={{ backgroundColor: "#d32f2f" }}
          onPress={handleDropTables}
        />
      </Container>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
});
