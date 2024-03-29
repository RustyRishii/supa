import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Auth from "./lib/Auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./lib/screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bookmark from "./lib/screens/bookmark";
import Settings from "./lib/screens/settings";
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Tab } from "react-native-elements";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          position: "relative",
          fontSize: 13,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarActiveBackgroundColor: "white",
      }}
      initialRouteName="Home"
    >
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              color={"black"}
              size={20}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={"black"}
              size={20}
            />
          ),
        }}
        name="Bookmark"
        component={Bookmark}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? "settings" : "settings-outline"}
              color={"black"}
              size={20}
            />
          ),
        }}
        name="Settings"
        component={Settings}
      />
    </Tabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        options={{ animation: "slide_from_right" }}
        name="BottomTabs"
        component={BottomTabs}
      />
      <Stack.Screen
        options={{ animation: "slide_from_right" }}
        name="Auth"
        component={Auth}
      />
      <Stack.Screen
        options={{ animation: "slide_from_left" }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{ animation: "slide_from_left" }}
        name="Setting"
        component={Settings}
      />
    </Stack.Navigator>
  );
}

const App = (navigation: any) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.session();
      setSession(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      {session ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};
export default App;

const styles = StyleSheet.create({});
