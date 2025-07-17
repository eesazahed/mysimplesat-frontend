import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import TextArea from "@/components/ui/TextArea";
import ThemedText from "@/components/ui/ThemedText";
import { fetchNotes, saveNotes } from "@/utils/db";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";

const Notes = () => {
  const colorScheme = useColorScheme();

  const [notesTextContent, setNotesTextContent] = useState<string>("");

  useEffect(() => {
    const fetchNotesTextContent = async () => {
      const result = await fetchNotes();
      setNotesTextContent(
        result?.textContent || "Write down some things you've learned!\n\n"
      );
    };

    fetchNotesTextContent();
  }, []);

  const updateTextArea = async (text: string) => {
    setNotesTextContent(text);
    await saveNotes(text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Header title="Notes" />
          <ThemedText
            style={{
              marginBottom: 32,
              fontStyle: "italic",
              textAlign: "center",
              color: colorScheme === "dark" ? "#bbb" : "#888",
            }}
          >
            Autosave is turned on
          </ThemedText>
          <TextArea
            minHeight={500}
            value={notesTextContent}
            onChange={(e) => {
              const text = e.nativeEvent.text;
              updateTextArea(text);
            }}
          />
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Notes;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
});
