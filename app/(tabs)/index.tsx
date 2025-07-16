import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { RootStackParamList } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="SAT Prep App" />
        <ThemedText style={{ marginBottom: 32 }}>
          Are you preparing for your next SAT?
        </ThemedText>
        <ThemedText style={{ marginBottom: 32 }}>
          This app gives you real SAT-style practice problems and an interactive
          review session.
        </ThemedText>
        <ThemedText style={{ marginBottom: 64 }}>
          After each problem, you&apos;ll reflect on mistakes and guesses,
          helping you track patterns and avoid similar errors on the actual
          test.
        </ThemedText>
        <Button
          title="Take a test"
          onPress={() => navigation.navigate("test")}
        />
        <View style={{ marginVertical: 16 }} />
        <Button
          title="View your mistake tracker"
          onPress={() => navigation.navigate("tracker")}
        />
        <View style={{ marginVertical: 32 }} />
        <ThemedText style={{ marginBottom: 32 }}>Updates:</ThemedText>
        <ThemedText style={{ marginBottom: 64 }}>blah blah blah</ThemedText>
      </Container>
    </ScrollView>
  );
};

// todo: add updates

export default Home;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
});
