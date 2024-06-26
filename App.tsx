import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Auth from "./lib/Auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./lib/screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bookmark from "./lib/screens/bookmark";
import SettingsPage from "./lib/screens/settings";
import Icon from "react-native-vector-icons/Ionicons";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";

const AuthStackNavigator = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function BottomTabs() {
    return (
      <Tabs.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            position: "relative",
            fontSize: 13,
          },
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: "#243447",
          tabBarInactiveBackgroundColor: "#243447",
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <Tabs.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                name={focused ? "home" : "home-outline"}
                color={"white"}
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
                color={"white"}
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
                color={"white"}
                size={20}
              />
            ),
          }}
          name="SettingsPage"
          component={SettingsPage}
        />
      </Tabs.Navigator>
    );
  }

  function AuthStack() {
    return (
      <AuthStackNavigator.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false }}
      >
        <AuthStackNavigator.Screen
          options={{
            animation: "slide_from_right",
          }}
          name="Auth"
          component={Auth}
        />
        <AuthStackNavigator.Screen
          options={{
            animation: "slide_from_left",
          }}
          name="SettingsPage"
          component={SettingsPage}
        />
        <AuthStackNavigator.Screen
          options={{
            animation: "slide_from_right",
          }}
          name="BottomTabs"
          component={BottomTabs}
        />
      </AuthStackNavigator.Navigator>
    );
  }

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
