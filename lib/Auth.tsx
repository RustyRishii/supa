import {
  Alert,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
  AppState,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "./utlities/supabase";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import universalStyles from "../components/universalStyles";
import { Colors } from "./utlities/colors";
import LabelText from "../components/labelText";
import GoogleAuth from "../components/GoogleAuth";
import Button from "../components/buttons";

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
      <View>
        <Image
          width={150}
          height={150}
          style={{
            backgroundColor: "gray",
            marginVertical: 10,
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
          borderRadius={150}
          source={{
            uri:
              // userInfo?.photo ||
              "https://hlgnifpdoxwdaezhvlru.supabase.co/storage/v1/object/public/User%20Profile/pfp/pfp.png",
          }}
        />

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
        <Button text="Sign Up" onPress={signUp} />
        <Button text="Sign In" onPress={signIn} />
        <Text
          style={{
            color: "white",
            fontSize: 25,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            textAlign: "center",
            paddingVertical: 10,
          }}
        >
          Or
        </Text>
        <GoogleAuth />
      </View>
    </SafeAreaView>
  );
};

export default Auth;
