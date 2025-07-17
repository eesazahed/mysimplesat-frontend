import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { ExternalPathString, Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const About = () => {
  const [mailto, setMailto] = useState<ExternalPathString | null>(null);
  const [email, setEmail] = useState<string>("[click to reveal]");

  const updateEmail = () => {
    if (!mailto) {
      const decrypted = atob("ZWVzYUBoYWNrY2x1Yi5hcHA=");
      setMailto(`mailto:${decrypted}`);
      setEmail(decrypted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="About" />

        <ThemedText style={{ marginBottom: 16 }}>
          I created this app while I was studying for the SAT. It started as a
          personal project, but I had three clear goals in mind from the
          beginning:
        </ThemedText>

        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          1. I wanted to improve my own SAT preparation. By building this app, I
          had the opportunity to solve a ton of practice problems.
        </ThemedText>
        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          2. I wanted to create a helpful and free resource for other students
          who are preparing for the SAT.
        </ThemedText>
        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          3. I saw this as an opportunity to practice and improve my mobile
          development skills. I also used this app to apply for a grmant through{" "}
          <Link style={styles.link} href="https://gemini.hackclub.com">
            Hack Club
          </Link>
          .
        </ThemedText>

        <ThemedText style={{ marginTop: 16, marginBottom: 16 }}>
          This app is completely open source and available on{" "}
          <Link
            style={styles.link}
            href="https://github.com/eesazahed/SAT-prep-app"
          >
            GitHub
          </Link>
          . If you have any thoughts, suggestions, or feedback, I&apos;d love to
          hear them.
        </ThemedText>

        <ThemedText style={{ marginBottom: 16 }}>
          Contact me at{" "}
          {mailto ? (
            <Link href={mailto} style={styles.email}>
              {email}
            </Link>
          ) : (
            <ThemedText onPress={updateEmail} style={styles.email}>
              {email}
            </ThemedText>
          )}
        </ThemedText>
      </Container>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  link: {
    color: "#20a9d5",
    cursor: "pointer",
  },
  email: {
    cursor: "pointer",
    color: "#beab00",
  },
});
