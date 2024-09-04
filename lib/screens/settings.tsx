import { Text, Pressable, View, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utlities/supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import universalStyles from "../../components/universalStyles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Colors } from "../utlities/colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Button from "../../components/buttons";
import { useFocusEffect } from "@react-navigation/native";

const SettingsPage = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string | null;
    email: string | null;
    photo: string | null;
  } | null>(null);

  const fetchUserInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          name: user.user_metadata.full_name || null,
          email: user.email ?? null,
          photo: user.user_metadata.avatar_url || null,
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    // const fetchBookmarkCount = async () => {
    //   const count = await getBookmarkCount();
    //   setBookmarkCount(count);
    // };

    // fetchBookmarkCount();
  }, []);

  // const signOut = async () => {
  //   try {
  //     await supabase.auth.signOut();
  //     navigation.navigate("Auth");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await supabase.auth.signOut();
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
          <View style={{ paddingHorizontal: 5 }}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Pressable onPress={() => console.log("Image opened")}>
                <Image
                  width={150}
                  height={150}
                  style={{ backgroundColor: "gray", marginVertical: 10 }}
                  borderRadius={150}
                  source={{
                    uri:
                      userInfo?.photo ||
                      "https://hlgnifpdoxwdaezhvlru.supabase.co/storage/v1/object/public/User%20Profile/pfp/pfp.png",
                  }}
                />
              </Pressable>
              {userInfo?.name && (
                <Text
                  style={{ fontSize: 20, paddingVertical: 10, color: "white" }}
                >
                  Name: {userInfo.name}
                </Text>
              )}
              {userInfo?.email && (
                <Text
                  style={{ fontSize: 20, paddingVertical: 10, color: "white" }}
                >
                  Email: {userInfo.email}
                </Text>
              )}
            </View>
            <Button onPress={googleSignOut} text="Sign Out" />
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default SettingsPage;
