import { InTestProvider } from "@/context/InTestContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomDarkTheme, CustomLightTheme } from "@/themes";
import initDB from "@/utils/db";
import { ThemeProvider } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RootLayout = () => {
  const colorScheme = useColorScheme();

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

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
    >
      <InTestProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </View>
      </InTestProvider>
    </ThemeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
