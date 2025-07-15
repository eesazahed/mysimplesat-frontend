import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { dropTables } from "@/utils/db";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Settings = () => {
  const [buttonText, setButtonText] = useState("Clear your mistake tracker");

  const handleDropTables = async () => {
    try {
      setButtonText("Clearing...");
      await dropTables();
      setTimeout(() => {
        setButtonText("Clear your mistake tracker");
      }, 1000);
    } catch (error) {
      console.error("Failed to drop answers table", error);
      setButtonText("Clear your mistake tracker");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View>
          <Header title="Settings" />

          <ThemedText style={{ marginBottom: 32 }}>
            Here&apos;s the settings page.
          </ThemedText>
          <Button
            title={buttonText}
            style={{ backgroundColor: "red" }}
            onPress={handleDropTables}
          />
        </View>
      </Container>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
});
