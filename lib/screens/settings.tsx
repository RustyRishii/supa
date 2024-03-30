import { Alert, StyleSheet, Text, Pressable, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

const Settings = ({ navigation }: { navigation: any }) => {
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
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
