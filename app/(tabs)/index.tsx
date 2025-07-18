import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { RootStackParamList, Update } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const [updates, setUpdates] = useState<Update[]>([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch("https://sat.eesa.hackclub.app/updates");

        const data = await response.json();
        setUpdates(data.reverse());
      } catch {
        setUpdates([]);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="MySimpleSAT" />
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

        <View>
          <View style={[styles.buttonRow, { marginVertical: 8 }]}>
            <View style={[styles.buttonContainer, { paddingRight: 8 }]}>
              <Button
                title="Take a test"
                onPress={() => navigation.navigate("test")}
              />
            </View>
            <View style={[styles.buttonContainer, { paddingLeft: 8 }]}>
              <Button
                title="Mistake tracker"
                onPress={() => navigation.navigate("tracker")}
              />
            </View>
          </View>
          <View style={[styles.buttonRow, { marginVertical: 8 }]}>
            <View style={[styles.buttonContainer, { paddingRight: 8 }]}>
              <Button
                title="AI Tutor"
                onPress={() => navigation.navigate("chat")}
              />
            </View>
            <View style={[styles.buttonContainer, { paddingLeft: 8 }]}>
              <Button
                title="Your notes"
                onPress={() => navigation.navigate("notes")}
              />
            </View>
          </View>
          <View style={[styles.buttonRow, { marginVertical: 8 }]}>
            <View style={[styles.buttonContainer, { paddingRight: 8 }]}>
              <Button
                title="Vocab quiz"
                onPress={() => navigation.navigate("vocab")}
              />
            </View>
            <View style={[styles.buttonContainer, { paddingLeft: 8 }]}>
              <Button
                title="View on GitHub"
                onPress={() =>
                  Linking.openURL("https://github.com/eesazahed/SAT-prep-app")
                }
              />
            </View>
          </View>
          <View style={[styles.buttonRow, { marginVertical: 8 }]}>
            <View style={[styles.buttonContainer, { paddingRight: 8 }]}>
              <Button
                title="About"
                onPress={() => navigation.navigate("about")}
                style={{ backgroundColor: "gray" }}
              />
            </View>
            <View style={[styles.buttonContainer, { paddingLeft: 8 }]}>
              <Button
                title="Privacy Policy"
                onPress={() => navigation.navigate("privacypolicy")}
                style={{ backgroundColor: "gray" }}
              />
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 32 }} />
        {updates && updates.length > 0 && (
          <View>
            <ThemedText style={{ marginBottom: 32 }}>
              Updates from developer:
            </ThemedText>
            {updates.map((update) => {
              return (
                <View
                  key={update.id}
                  style={[
                    styles.update,
                    colorScheme === "dark"
                      ? styles.darkUpdate
                      : styles.lightUpdate,
                  ]}
                >
                  <ThemedText style={{ fontFamily: "LatoBold", fontSize: 24 }}>
                    {update.title}
                  </ThemedText>
                  <ThemedText style={{ marginTop: 16, marginBottom: 24 }}>
                    {update.body}
                  </ThemedText>
                  <ThemedText
                    style={{ color: colorScheme === "dark" ? "#bbb" : "#888" }}
                  >
                    {new Date(update.timestamp).toLocaleString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        )}
      </Container>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  update: {
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkUpdate: {
    backgroundColor: "#323232",
    borderColor: "#323232",
  },
  lightUpdate: {
    backgroundColor: "transparent",
    borderColor: "#ccc",
  },
  buttonRow: {
    flexDirection: "row",
  },
  buttonContainer: { width: "50%" },
});
