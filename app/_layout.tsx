import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomDarkTheme, CustomLightTheme } from "@/themes";
import initDB from "@/utils/db";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const createTable = async () => {
      try {
        await initDB();
      } catch {
        return;
      }
    };
    createTable();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
    >
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </View>
    </ThemeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
