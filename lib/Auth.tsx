import {
  Alert,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
  AppState,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./utlities/supabase";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import Bookmark from "./screens/bookmark";
import universalStyles from "../components/universalStyles";
import { Colors } from "./utlities/colors";
import LabelText from "../components/labelText";
import GoogleAuth from "../components/GoogleAuth";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const Auth = ({ navigation }: { navigation: any }) => {
  //const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const signUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            userName: userName,
          },
        },
      });
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        navigation.navigate("BottomTabs", { screen: "Home" });
        ToastAndroid.show("Account created", ToastAndroid.SHORT);
        // Save user info to AsyncStorage
        //await AsyncStorage.setItem("userToken", user?.access_token);
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userName", userName);
      }
    } catch (error) {
      if (error === "Email already exists") {
        ToastAndroid.show("Email Already exists", ToastAndroid.SHORT);
        console.error(error);
      }
    }
  };

  const signIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        await AsyncStorage.setItem("userEmail", email);
        navigation.navigate("BottomTabs", { screen: "Home" });
        ToastAndroid.show("User SingedIn", ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error === "Email already exists") {
        ToastAndroid.show("Email Already exists", ToastAndroid.SHORT);
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView
      style={{ padding: 10, backgroundColor: "#121212", height: "100%" }}
    >
      <StatusBar backgroundColor="#1E1E1E" style="light" />
      <View style={{}}>
        <LabelText LabelText="Name" />
        <TextInput
          placeholder="Username"
          placeholderTextColor={Colors.placeHolder}
          cursorColor={Colors.cursorColor}
          keyboardType="name-phone-pad"
          value={userName}
          onChangeText={(txt) => {
            setUserName(txt);
            setUserName;
          }}
          style={universalStyles.TextInput}
        />
        <LabelText LabelText="Email" />
        <TextInput
          placeholder="Email"
          placeholderTextColor={Colors.placeHolder}
          cursorColor={Colors.cursorColor}
          keyboardType="email-address"
          value={email}
          onChangeText={(txt) => {
            setEmail(txt);
            setEmail;
          }}
          style={universalStyles.TextInput}
        />
        <LabelText LabelText="Password" />
        <TextInput
          placeholder="Password"
          placeholderTextColor={Colors.placeHolder}
          keyboardType="visible-password"
          cursorColor={Colors.cursorColor}
          style={universalStyles.TextInput}
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            setPassword;
          }}
        />
        <Pressable onPress={() => signUp()} style={universalStyles.authButtons}>
          <Text style={universalStyles.authButtonText}>Sign Up</Text>
        </Pressable>
        <Pressable onPress={() => signIn()} style={universalStyles.authButtons}>
          <Text style={universalStyles.authButtonText}>Sign In</Text>
        </Pressable>
      </View>
      <GoogleAuth />
    </SafeAreaView>
  );
};

export default Auth;
