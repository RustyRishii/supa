import {
  Alert,
  StyleSheet,
  Text,
  Pressable,
  View,
  Animated,
} from "react-native";
import React, { Component } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import {
  FlatList,
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"black"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"black"} />
);

const Settings = ({ navigation }: { navigation: any }) => {
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const userEmail = await AsyncStorage.getItem("userEmail");
      setEmail(userEmail || "No email found");
    };

    fetchEmail();
  }, []);

  const signOut = async () => {
    try {
      supabase.auth.signOut();
      navigation.navigate("AuthStack");
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <GestureHandlerRootView>
        <Text>Email : {email}</Text>
        <Pressable onPress={() => signOut()} style={styles.singOutButton}>
          <Text style={{ fontSize: 20, color: "white" }}>Sign Out</Text>
        </Pressable>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  singOutButton: {
    backgroundColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  swipableTest: {
    width: "100%",
    height: 100,
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
