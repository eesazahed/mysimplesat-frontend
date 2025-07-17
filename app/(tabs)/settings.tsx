import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { dropTables } from "@/utils/db";
import { scheduleDailyNotification } from "@/utils/scheduleDailyNotification";
import React, { useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

const Settings = () => {
  const colorScheme = useColorScheme();

  const [buttonText, setButtonText] = useState("Reset mistake tracker");
  const [selectedHour, setSelectedHour] = useState(15);

  const handleDropTables = async () => {
    try {
      setButtonText("Resetting...");
      await dropTables();
      setTimeout(() => {
        setButtonText("Reset mistake tracker");
      }, 1000);
      1;
    } catch (error) {
      console.error("Failed to drop answers table", error);
      setButtonText("Reset mistake tracker");
    }
  };

  const incrementHour = () => setSelectedHour((prev) => (prev + 1) % 24);
  const decrementHour = () => setSelectedHour((prev) => (prev + 23) % 24);

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="Settings" />

        <View style={{ marginBottom: 64 }}>
          <ThemedText style={styles.label}>
            Choose daily notification time: {formatHour(selectedHour)}
          </ThemedText>

          <View style={styles.hourSelector}>
            <Button
              title="-"
              onPress={decrementHour}
              customColor={colorScheme === "dark" ? "white" : "black"}
              style={[
                styles.adjustButton,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#323232" : "transparent",
                  borderColor: colorScheme === "dark" ? "#323232" : "#ccc",
                },
              ]}
              fontSize={24}
            />
            <View
              style={[
                styles.hourDisplay,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#323232" : "transparent",
                  borderColor: colorScheme === "dark" ? "#323232" : "#ccc",
                },
              ]}
            >
              <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
                {selectedHour}
              </ThemedText>
            </View>
            <Button
              title="+"
              onPress={incrementHour}
              customColor={colorScheme === "dark" ? "white" : "black"}
              style={[
                styles.adjustButton,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#323232" : "transparent",
                  borderColor: colorScheme === "dark" ? "#323232" : "#ccc",
                },
              ]}
              fontSize={24}
            />
          </View>

          <Button
            title="Save Notification Time"
            onPress={() => scheduleDailyNotification(selectedHour)}
          />
        </View>

        <View>
          <ThemedText style={{ marginBottom: 32 }}>
            Would you like to reset your mistake tracker?
          </ThemedText>
          <Button
            title={buttonText}
            style={{ backgroundColor: "#d32f2f", marginBottom: 40 }}
            onPress={handleDropTables}
          />
        </View>
      </Container>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  label: {
    marginBottom: 24,
  },
  hourSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  adjustButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  hourDisplay: {
    height: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 20,
    borderRadius: 10,
  },
});
