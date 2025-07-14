import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import initDB, { fetchAnswers } from "@/utils/db";
import "katex/dist/katex.min.css";
import { useEffect } from "react";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const createTable = async () => {
      const db = await initDB();

      const rows = await fetchAnswers(db);
      // test
      console.log(123, rows);
    };

    createTable();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ title: "Take a Test" }} />
        <Stack.Screen name="questions" options={{ title: "Questions" }} />
        <Stack.Screen name="review" options={{ title: "Review" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default RootLayout;
