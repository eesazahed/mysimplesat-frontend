import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";

const example = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View>
          <Header title="example" />

          <ThemedText>example</ThemedText>
          <Button title="example" onPress={() => {}} />
        </View>
      </Container>
    </ScrollView>
  );
};

export default example;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 150 },
});
