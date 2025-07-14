import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Container style={styles.container}>
        <Header title="Page Not Found" style={{ marginTop: 0 }} />

        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  link: {
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 15,
  },
});

export default NotFoundScreen;
