import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View>
          <Header title="welcome" />

          <ThemedText>hi</ThemedText>
        </View>
      </Container>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
});
