import HapticTab from "@/components/HapticTab";
import { useInTest } from "@/context/InTestContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const TabLayout = () => {
  const { inTest } = useInTest();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          default: {
            height: 120,
            display: !inTest ? "flex" : "none",
          },
        }),
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          marginTop: 20,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" color={color} size={28} />
          ),
          href: !inTest ? "/(tabs)" : null,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="test"
        options={{
          title: "Take a test",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="book" color={color} size={28} />
          ),
          href: !inTest ? "/(tabs)/test" : null,
        }}
      />

      <Tabs.Screen
        name="questions"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="tracker"
        options={{
          title: "Mistake tracker",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" color={color} size={28} />
          ),
          href: !inTest ? "/(tabs)/tracker" : null,
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" color={color} size={28} />
          ),
          href: !inTest ? "/(tabs)/stats" : null,
        }}
      />

      <Tabs.Screen
        name="sessiondetail"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" color={color} size={28} />
          ),
          href: !inTest ? "/(tabs)/settings" : null,
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="privacypolicy"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="example"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
