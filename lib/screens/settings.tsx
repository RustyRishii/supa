import { Alert, StyleSheet, Text, Pressable, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

const Settings = ({
  navigation,
  session,
}: {
  navigation: any;
  session: Session;
}) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

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
