import { InTestProvider } from "@/context/InTestContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomDarkTheme, CustomLightTheme } from "@/themes";
import initDB from "@/utils/db";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
    LatoBold: require("../assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    const createTable = async () => {
      try {
        await initDB();
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Notification permission not granted");
        }
      } catch {
        return;
      }
    };
    createTable();
  }, []);

  if (!loaded) {
    return null;
  }

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
