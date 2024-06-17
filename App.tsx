import { StyleSheet, View } from "react-native";
import React from "react";
import Auth from "./lib/Auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./lib/screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Bookmark from "./lib/screens/bookmark";
import SettingsPage from "./lib/screens/settings";
//import ViewImage from "./lib/screens/viewImage";
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Swipeable } from "react-native-gesture-handler";
import CommunityPage from "./lib/screens/community";
import Modal from "./lib/screens/modal";

//const ModalStack = createNativeStackNavigator();

const AuthStackNavigator = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const Image = createNativeStackNavigator();

const App = (navigation: any) => {
  const [session, setSession] = useState<Session | null>(null);

  function BottomTabs() {
    return (
      <Tabs.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            position: "relative",
            fontSize: 13,
          },
          tabBarShowLabel: false,
          //tabBarActiveTintColor: "#243447",
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
                name={focused ? "people" : "people-outline"}
                color={"white"}
                size={20}
              />
            ),
          }}
          name="Community"
          component={Community}
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

  function Community() {
    return (
      <Stack.Navigator
        screenOptions={{ presentation: "modal", headerShown: false }}
        initialRouteName="CommunityPage"
      >
        <Stack.Screen
          name="CommunityPage"
          component={CommunityPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{ animation: "fade_from_bottom", animationDuration: 5000 }}
        />
      </Stack.Navigator>
    );
  }

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setSession(session);
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

  return (
    <NavigationContainer>
      {session ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
