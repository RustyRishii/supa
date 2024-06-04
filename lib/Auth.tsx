import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  AppState,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { StatusBar } from "expo-status-bar";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import Bookmark from "./screens/bookmark";
import universalStyles from "../components/universalStyles";

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

  GoogleSignin.configure({
    scopes: ["email", "profile"],
    webClientId:
      "633436539850-j820badpnksfhm4oo5pr2l7u3i4blhau.apps.googleusercontent.com",
  });

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
    <SafeAreaView style={{ padding: 10 }}>
      <StatusBar backgroundColor="black" style="light" />
      <View>
        <Text style={universalStyles.ReferenceText}>Name</Text>
        <TextInput
          placeholder="Username"
          cursorColor={"black"}
          keyboardType="name-phone-pad"
          value={userName}
          onChangeText={(txt) => {
            setUserName(txt);
            setUserName;
          }}
          style={universalStyles.TextInput}
        />
        <Text style={universalStyles.ReferenceText}>Email</Text>
        <TextInput
          placeholder="Email"
          cursorColor={"black"}
          keyboardType="email-address"
          value={email}
          onChangeText={(txt) => {
            setEmail(txt);
            setEmail;
          }}
          style={universalStyles.TextInput}
        />
        <Text style={universalStyles.ReferenceText}>Password</Text>
        <TextInput
          style={universalStyles.TextInput}
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            setPassword;
          }}
          placeholder="Password"
          keyboardType="visible-password"
          cursorColor={"black"}
        />
        <Pressable
          onPress={() => signUp()}
          style={{
            backgroundColor: "black",
            borderRadius: 5,
            marginVertical: 20,
            borderWidth: 1,
            height: 50,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>Sign Up</Text>
        </Pressable>
        <Pressable
          onPress={() => signIn()}
          style={{
            backgroundColor: "black",
            borderRadius: 5,
            marginVertical: 20,
            borderWidth: 1,
            height: 50,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>Sign In</Text>
        </Pressable>
      </View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: userInfo.idToken,
              });
              console.log(error, data);
            } else {
              throw new Error("no ID token present!");
            }
            navigation.navigate("BottomTabs", { screen: "Home" });
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      />
    </SafeAreaView>
  );
};

export default Auth;
