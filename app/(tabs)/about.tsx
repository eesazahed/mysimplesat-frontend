import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { Link } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="About" />
        <ThemedText style={{ marginBottom: 16 }}>
          Are you preparing for your next SAT?
        </ThemedText>

        <ThemedText style={{ marginBottom: 16 }}>
          This app gives you real SAT-style practice problems and an interactive
          review session.
        </ThemedText>

        <ThemedText style={{ marginBottom: 16 }}>
          After each problem, you&apos;ll reflect on mistakes and guesses,
          helping you track patterns and avoid similar errors on the actual
          test.
        </ThemedText>

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
          You can contact me at{" "}
          <Link href="mailto:eesa@hackclub.app" style={styles.email}>
            eesa@hackclub.app
          </Link>
          , I&apos;ll try to respond.
        </ThemedText>

        <ThemedText style={{ marginTop: 16, marginBottom: 16 }}>
          I&apos;ve also built{" "}
          <Link style={styles.link} href="https://gratefultime.app">
            GratefulTime
          </Link>
          , a modern digital gratitude journal. If you have an iOS or MacOS
          device, be sure to check it out! It&apos;s a simple, modern gratitude
          journal with:
        </ThemedText>

        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          - Space to write three gratitude items + a daily prompt
        </ThemedText>

        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          - A calendar to browse and reflect on past entries
        </ThemedText>

        <ThemedText style={{ marginBottom: 16, marginLeft: 16 }}>
          - AI-generated monthly summaries of what you&apos;ve written
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
