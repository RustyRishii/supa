import { Alert, StyleSheet, Text, Pressable, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import universalStyles from "../../components/universalStyles";
import App from "../../App";

const Settings = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const userEmail = await AsyncStorage.getItem("userEmail");
      const userName = await AsyncStorage.getItem("userName");
      setEmail(userEmail || "No email found");
    };

    fetchEmail();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.navigate("AuthStack");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <GestureHandlerRootView>
        <Text style={universalStyles.pageTitle}>Settings</Text>
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            width={150}
            height={150}
            style={{ backgroundColor: "gray" }}
            borderRadius={150}
            source={{
              uri: "https://hlgnifpdoxwdaezhvlru.supabase.co/storage/v1/object/public/User%20Profile/pfp/pfp.png",
            }}
          />
          <Text style={{ fontSize: 20, paddingVertical: 10 }}>
            Email : {email}
          </Text>
          {/* <Text style={{ fontSize: 20, paddingVertical: 10 }}>
            userName : {userName}
          </Text> */}
        </View>
        <Pressable onPress={signOut} style={styles.signOutButton}>
          <Text style={{ fontSize: 20, color: "white" }}>Sign Out</Text>
        </Pressable>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
