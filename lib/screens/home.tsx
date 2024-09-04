import NetInfo from "@react-native-community/netinfo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import {
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { PERMISSIONS, request } from "react-native-permissions";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import universalStyles from "../../components/universalStyles";
import { Colors } from "../utlities/colors";
import { supabase } from "../utlities/supabase";
//import CopyButton from../../components/interactionButons/copyComponentnt";
import CopyButton from "../../components/interactionButons/copyComponent";
import LottieView from "lottie-react-native";

const downloadIconFilled = (
  <Icon name="download" size={Colors.iconSize} color={"#1D9BF0"} />
);
const downloadIconOutline = (
  <Icon name="download-outline" size={Colors.iconSize} color={"white"} />
);

const Home = () => {
  //const [postIcon, setPostIcon] = useState(downloadIconOutline);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(true);
  const [apiData, setAPIData] = useState<
    { text: string; author: string } | undefined
  >(undefined);

  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  const viewShotRef = useRef();

  var borderWidths = useSharedValue(0.2);
  var textOpacity = useSharedValue(1);

  const bookMarkLottieRef = useRef<LottieView>(null);

  function netCheck() {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        ToastAndroid.show("No internet", ToastAndroid.SHORT);
      }
    });
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        internetAlert();
      }
    });
    fetchAPIData();
    viewShotAnimations();

    return () => {
      unsubscribe();
    };
  }, []);

  const internetAlert = () => {
    Alert.alert(
      "Internet Connection",
      "You are offline. Some features may not be available."
    );
  };

  const bookmarkQuote = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    // from docs

    const userEmail = user?.email; //for Adding users Email to the bookmarks table.
    const userName = user?.user_metadata?.full_name; //Adds the display name that comes with Google Auth

    const { data, error } = await supabase.from("Bookmarks").insert({
      Quote: apiData?.text,
      Author: apiData?.author,
      email_id: userEmail,
      full_name: userName,
    });
    if (error) {
      console.error(error);
      ToastAndroid.show("No internet", ToastAndroid.SHORT);
      console.log(userName);
    } else {
      console.log("Bookmarked");
      ToastAndroid.show("Bookmarked", ToastAndroid.SHORT);
    }
  };

  const fetchAPIData = async () => {
    const url = "https://stoic-quotes.com/api/quote";
    try {
      setRefreshing(true);
      let urlResult = await fetch(url);
      let myData = await urlResult.json();
      setAPIData(myData);
      //console.log(myData);
      if (bookMarkLottieRef.current) {
        bookMarkLottieRef.current.reset(); // This will reset the bookmark animation to the start
      }
      setTimeout(() => {
        setRefreshing(false);
      }, 100);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  // async function quoteToPost() {
  //   const {
  //     data: { user },
  //     error: userError,
  //   } = await supabase.auth.getUser();

  //   var post_id = Math.random();

  //   const userEmail = user?.email;
  //   const { data, error } = await supabase.from("Posts").insert({
  //     post: `${apiData?.text} - ${apiData?.author}`,
  //     post_id: post_id,
  //     email_id: userEmail,
  //   });
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     postIconFunction();
  //     console.log("Quote To Post successful");
  //     ToastAndroid.show("Posted", ToastAndroid.SHORT);
  //   }
  // }

  // function postIconFunction() {
  //   setPostIcon(downloadIconFilled);
  //   setTimeout(() => {
  //     setPostIcon(downloadIconOutline);
  //   }, 200);
  // }

  const handleLongPress = async () => {
    try {
      // Request permissions if needed
      const permission = await request(
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );

      if (permission !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot save screenshot without permission"
        );
        return;
      }

      // Capture screenshot
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      const destPath = `${
        RNFS.PicturesDirectoryPath
      }/screenshot_${Date.now()}.png`;
      await RNFS.moveFile(uri, destPath);
      ToastAndroid.show("Saved to gallery", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Error", "An error occurred while taking the screenshot");
      console.error(error);
    }
  };

  function viewShotAnimations() {
    borderWidths.value = withTiming(borderWidths.value + 199, {
      duration: 500,
    });
    textOpacity.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      borderWidths.value = withTiming(0.2, {
        duration: 500,
      });
      textOpacity.value = withTiming(1, { duration: 1500 });
    }, 500);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.statusbar} style="light" />
      <GestureHandlerRootView>
        <ScrollView
          style={{
            backgroundColor: Colors.pageBackgroundColor,
            height: viewportHeight - tabBarHeight,
            padding: 10,
          }}
          contentContainerStyle={{
            justifyContent: "center",
            flex: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchAPIData();
                viewShotAnimations();
                netCheck();
              }}
            />
          }
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 1.0, height: 215 }}
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: 10,
            }}
          >
            <TouchableNativeFeedback onLongPress={handleLongPress}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderColor: Colors.iconColor,
                  backgroundColor: "#1E1E1E",
                  borderRadius: 10,
                  height: 215,
                  paddingHorizontal: 10,
                  elevation: 20,
                  shadowColor: "#121212",
                  shadowRadius: 10,
                  shadowOpacity: 1,
                  //overflow: "hidden",
                }}
              >
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderColor: Colors.iconColor,
                    borderRadius: 10,
                    borderTopWidth: 0.2,
                    borderBottomWidth: 0.2,
                    borderRightWidth: borderWidths,
                    borderLeftWidth: borderWidths,
                  }}
                />
                {apiData ? (
                  <Animated.View
                    style={{
                      opacity: textOpacity,
                    }}
                  >
                    <Text style={universalStyles.quote}>{apiData.text}</Text>
                    <Text style={universalStyles.author}>
                      - {apiData.author}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
            </TouchableNativeFeedback>
          </ViewShot>
          <View style={universalStyles.bookmarkAndCopy}>
            <CopyButton
              height={40}
              width={30}
              text={`${apiData?.text} - ${apiData?.author} `} //Copies the text
            />
            <TouchableNativeFeedback
              onPress={() => {
                bookmarkQuote();
                bookMarkLottieRef.current!.play();
              }}
            >
              <LottieView
                ref={bookMarkLottieRef}
                style={{ width: 40, height: 45 }} // Same size as CopyButton
                source={require("../../assets/animations/bookmark.json")}
                loop={false}
              />
            </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;

/*
<View style={universalStyles.bookmarkAndCopy}>
            <CopyButton text={`${apiData?.text} - ${apiData?.author}`} />
            <TouchableNativeFeedback
              onPress={() => {
                bookmarkCondition();
                LottieRef.current!.play();
              }}
            >
              <LottieView
                ref={LottieRef}
                style={{ width: 50, height: 50, backgroundColor: "" }} // Same size as CopyButton
                source={require("../../assets/bookmark.json")}
                loop={false}
              />
            </TouchableNativeFeedback> 
            </View>
            */
