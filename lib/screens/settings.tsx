import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utlities/supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import universalStyles from "../../components/universalStyles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Colors } from "../utlities/colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { googleSignOut } from "../utlities/google";

const SettingsPage = ({ navigation }: { navigation: any }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  // const [email, setEmail] = useState("");
  // const [image, setImage] = useState(null);

  const hasPlayServices = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      // google services are available
    } catch (err) {
      console.error("play services are not available");
    }
  };

  // const { name, email, photo } = userInfo || {};

  // if (!userInfo) {
  //   return <Text>Please sign in to view your profile.</Text>;
  // }

  // useEffect(() => {
  //   const fetchEmail = async () => {
  //     const userEmail = await AsyncStorage.getItem("userEmail");
  //     setEmail(userEmail || "No email found");
  //   };

  //   fetchEmail();
  // }, []);

  // const googleSignOut = async () => {
  //   try {
  //     await GoogleSignin.signOut();
  //     setState({ user: null }); // Remember to remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.navigate("Auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            backgroundColor: Colors.pageBackgroundColor,
            height: viewportHeight - tabBarHeight,
          }}
        >
          <Text style={universalStyles.pageTitle}>Settings</Text>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <Pressable onPress={() => console.log("Image opened")}>
              <Image
                width={150}
                height={150}
                style={{ backgroundColor: "gray", marginVertical: 10 }}
                borderRadius={150}
                source={{
                  uri: "https://hlgnifpdoxwdaezhvlru.supabase.co/storage/v1/object/public/User%20Profile/pfp/pfp.png",
                }}
              />
            </Pressable>
            <Text style={{ fontSize: 20, paddingVertical: 10, color: "white" }}>
              {/* Email : {email} */}
            </Text>
            <Pressable onPress={googleSignOut} style={styles.signOutButton}>
              <Text style={{ fontSize: 20, color: "white" }}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    width: 150,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
function setUserInfo(arg0: null) {
  throw new Error("Function not implemented.");
}
