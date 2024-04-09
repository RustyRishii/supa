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
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"black"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"black"} />
);

const Settings = ({ navigation }: { navigation: any }) => {
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);

  const signOut = async () => {
    try {
      supabase.auth.signOut();
      navigation.navigate("Auth");
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <GestureHandlerRootView>
        <Pressable
          onPress={() => signOut()}
          style={{
            backgroundColor: "black",
            borderRadius: 5,
            borderWidth: 1,
            height: 50,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>Sign Out</Text>
        </Pressable>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
