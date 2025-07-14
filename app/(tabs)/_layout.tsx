import HapticTab from "@/components/HapticTab";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 100,
          },
          default: {
            height: 100,
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
          href: "/(tabs)",
        }}
      />
      ,
      <Tabs.Screen
        name="test"
        options={{
          title: "Take a test",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="book" color={color} size={28} />
          ),
          href: "/(tabs)/test",
        }}
      />
      ,
      <Tabs.Screen
        name="questions"
        options={{
          href: null,
        }}
      />
      ,
      <Tabs.Screen
        name="review"
        options={{
          href: null,
        }}
      />
      ,
      <Tabs.Screen
        name="tracker"
        options={{
          title: "Mistake tracker",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" color={color} size={28} />
          ),
          href: "/(tabs)/tracker",
        }}
      />
      ,
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
