import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import ThemedText from "@/components/ui/ThemedText";
import { RootStackParamList } from "@/types";
import { fetchSessionStats } from "@/utils/db";
import formatCategory from "@/utils/formatCategory";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

const PAGE_SIZE = 20;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stats = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();

  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          const data = await fetchSessionStats();
          setSessions(data);
        } catch {
          setSessions([]);
        } finally {
          setLoading(false);
        }
      };
      loadStats();
    }, [])
  );

  const allTimeStats = useMemo(() => {
    const totalTestsTaken = sessions.length;
    const totalCorrect = sessions.reduce(
      (acc, cur) => acc + (cur.correct || 0),
      0
    );
    const totalQuestionsDone = sessions.reduce(
      (acc, cur) => acc + (cur.total || 0),
      0
    );
    const averagePercent =
      totalQuestionsDone === 0
        ? 0
        : Math.round((totalCorrect / totalQuestionsDone) * 100);

    return {
      totalTestsTaken,
      totalCorrect,
      totalQuestionsDone,
      averagePercent,
    };
  }, [sessions]);

  const paginatedSessions = useMemo(() => {
    return sessions.slice(0, page * PAGE_SIZE);
  }, [sessions, page]);

  const canLoadMore = paginatedSessions.length < sessions.length;

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Container>
          <Header title="Stats" />
          <ThemedText style={{ textAlign: "center", marginTop: 100 }}>
            Loading...
          </ThemedText>
        </Container>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <Header title="Stats" />

        <View style={styles.summaryContainer}>
          {[
            { label: "Total tests taken", value: allTimeStats.totalTestsTaken },
            {
              label: "Total correct answers",
              value: allTimeStats.totalCorrect,
            },
            {
              label: "Total questions done",
              value: allTimeStats.totalQuestionsDone,
            },
            {
              label: "Average percent score",
              value: allTimeStats.averagePercent + "%",
            },
          ].map((item, i, arr) => (
            <View
              key={item.label}
              style={[
                styles.summaryRow,
                i === arr.length - 1 && styles.summaryRowLast,
                colorScheme === "dark" && styles.summaryRowDarkBg,
              ]}
            >
              <ThemedText style={styles.label}>{item.label}</ThemedText>
              <ThemedText style={styles.value}>{item.value}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText
          style={{
            fontSize: 18,
            marginBottom: 32,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Your previous tests
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={styles.tableContainer}
        >
          <View style={styles.table}>
            <View
              style={[
                styles.tableRow,
                {
                  backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#ccc",
                },
              ]}
            >
              <ThemedText style={styles.idCell}>ID</ThemedText>
              <ThemedText style={styles.dateCell}>Date</ThemedText>
              <ThemedText style={styles.timeCell}>Time</ThemedText>
              <ThemedText style={styles.subjectCell}>Subject</ThemedText>
              <ThemedText style={styles.difficultyCell}>Difficulty</ThemedText>
              <ThemedText style={styles.correctCell}>Correct</ThemedText>
              <ThemedText style={styles.totalCell}>Total</ThemedText>
              <ThemedText style={styles.percentCell}>%</ThemedText>
              <ThemedText style={styles.detailsCell}>Questions</ThemedText>
            </View>

            {paginatedSessions.map((sesh, index) => {
              const percent =
                sesh.total === 0
                  ? 0
                  : Math.round((sesh.correct / sesh.total) * 100);

              const date = new Date(sesh.createdAt);
              const isLastRow = index === paginatedSessions.length - 1;

              return (
                <View
                  key={sesh.id}
                  style={[
                    styles.tableRow,
                    isLastRow && styles.tableRowLast,
                    colorScheme === "dark" && styles.tableRowDarkBg,
                  ]}
                >
                  <ThemedText style={styles.idCell}>{sesh.id}</ThemedText>
                  <ThemedText style={styles.dateCell}>
                    {date
                      .toLocaleDateString(undefined, {
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace("-", "/")}
                  </ThemedText>
                  <ThemedText style={styles.timeCell}>
                    {date.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </ThemedText>
                  <ThemedText style={styles.subjectCell}>
                    {formatCategory(sesh.subject)}
                  </ThemedText>
                  <ThemedText style={styles.difficultyCell}>
                    {formatCategory(sesh.difficulty)}
                  </ThemedText>
                  <ThemedText style={styles.correctCell}>
                    {sesh.correct}
                  </ThemedText>
                  <ThemedText style={styles.totalCell}>{sesh.total}</ThemedText>
                  <ThemedText style={styles.percentCell}>{percent}%</ThemedText>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("sessiondetail", { session: sesh })
                    }
                    style={styles.detailsCell}
                  >
                    <ThemedText
                      style={{ color: "#007aff", textAlign: "center" }}
                    >
                      View
                    </ThemedText>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ marginTop: 20, marginBottom: 50 }}>
          {canLoadMore && (
            <Button
              title="Load More"
              onPress={() => setPage((p) => p + 1)}
              variant="primary"
            />
          )}
        </View>
      </Container>
    </ScrollView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 50 },
  summaryContainer: {
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 12,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },
  summaryRowDarkBg: {
    backgroundColor: "#323232",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
  },
  value: {
    marginRight: 8,
    fontSize: 16,
  },
  tableContainer: {
    minWidth: "100%",
  },
  table: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 0,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 2,
    paddingTop: 2,
    backgroundColor: "transparent",
  },
  tableRowDarkBg: {
    backgroundColor: "#323232",
  },
  tableRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 8,
  },
  idCell: {
    width: 50,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  dateCell: {
    width: 60,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  timeCell: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  subjectCell: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  difficultyCell: {
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  correctCell: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  totalCell: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  percentCell: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
  },
  detailsCell: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
});
