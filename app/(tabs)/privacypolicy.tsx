import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

const policies = [
  {
    title: `Introduction`,
    details: `MySimpleSAT ("the App") prioritizes your privacy and data security. This policy explains what data we collect, how we use it, and your rights.`,
  },
  {
    title: `Information We Collect`,
    details: `We do not collect any of your data. Everything is stored locally on your device.`,
  },
  {
    title: `Use of Information`,
    details: `We do not have access to any of your information.`,
  },
  {
    title: `Data Storage and Security`,
    details: `Data is stored locally on your device and is never uploaded to any cloud databases.`,
  },
  {
    title: `AI Response Generation`,
    details: `AI responses are generated using Hack Club's free and open source AI service. All AI requests and responses are logged by Hack Club to prevent abuse. Data is not shared with any other third parties.`,
  },
  {
    title: `Children's Privacy`,
    details: `The app is not for children under 13, and we do not knowingly collect data from them.`,
  },
  {
    title: `Changes to This Policy`,
    details: `We may update this policy; users will be notified of significant changes.`,
  },
  {
    title: `Contact`,
    details: `Questions? Contact: eesa@hackclub.app`,
  },
  {
    title: `Legal Compliance`,
    details: `This policy complies with applicable data protection laws, including GDPR and CCPA where relevant.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="PrivacyPolicy" />

        {policies.map((policy, index) => {
          return (
            <View key={index} style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {index + 1}. {policy.title}
              </ThemedText>
              <ThemedText style={styles.sectionDetails}>
                {policy.details}
              </ThemedText>
            </View>
          );
        })}

        <ThemedText style={{ marginTop: 16, marginBottom: 16 }}>
          This app is completely open source and available on{" "}
          <Link
            style={styles.link}
            href="https://github.com/eesazahed/SAT-prep-app"
          >
            GitHub
          </Link>
          .
        </ThemedText>
      </Container>
    </ScrollView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDetails: {
    marginLeft: 16,
  },
  link: {
    color: "#20a9d5",
    cursor: "pointer",
  },
});
