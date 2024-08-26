import NetInfo from "@react-native-community/netinfo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import {
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { PERMISSIONS, request } from "react-native-permissions";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ViewShot from "react-native-view-shot";
import universalStyles from "../../components/universalStyles";
import { Colors } from "../utlities/colors";
import { supabase } from "../utlities/supabase";
import * as Clipboard from "expo-clipboard";
import Copy from "../../components/copyComponent";
import Rive from "rive-react-native";

const copyIconFilled = (
  <Icon name="copy" size={Colors.iconSize} color={Colors.iconColor} />
);
const copyIconOutline = (
  <Icon name="copy-outline" size={Colors.iconSize} color={Colors.iconColor} />
);

const bookmarkIconFilled = (
  <Icon name="bookmark" size={Colors.iconSize} color={Colors.iconColor} />
);
const bookmarkIconOutline = (
  <Icon
    name="bookmark-outline"
    size={Colors.iconSize}
    color={Colors.iconColor}
  />
);

const downloadIconFilled = (
  <Icon name="download" size={Colors.iconSize} color={"#1D9BF0"} />
);
const downloadIconOutline = (
  <Icon name="download-outline" size={Colors.iconSize} color={"white"} />
);

const Home = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);
  const [postIcon, setPostIcon] = useState(downloadIconOutline);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(true);
  //const [copiedText, setCopiedText] = React.useState("");
  const [apiData, setAPIData] = useState<
    { text: string; author: string } | undefined
  >(undefined);

  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  const viewShotRef = useRef();
  const riveRef = useRef(null);

  var borderWidths = useSharedValue(0.2);
  var textOpacity = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  var bgColor = useSharedValue("#0000"); // Initialize with black

  const [showCopy, setShowCopy] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const reAnimCopy = async () => {
    copyIconFunction();
    if (!showCopy) {
      setShowCopy(true);
      translateX.value = withSpring(5);
      translateY.value = withSpring(5);
      bgColor.value = withTiming("#ff6347", { duration: 1000 }); // Change to desired color
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      bgColor.value = withTiming("#ff6347", { duration: 1000 });
      //setShowCopy(false);
    }

    setTimeout(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      bgColor.value = withTiming("#000", { duration: 1000 }); // Revert back to black
    }, 1000);

    setTimeout(() => {
      setShowCopy(false);
    }, 1500);
  };

  const Copy = ({ backgroundColor }: { backgroundColor: string }) => {
    return (
      <Animated.View
        style={[
          {
            height: 20,
            width: 20,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: "tomato",
            backgroundColor: bgColor, // Apply the animated background color here
          },
        ]}
      />
    );
  };

  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
    };
  });

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
        showAlert();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showAlert = () => {
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

    const userEmail = user?.email;
    const userName = user?.user_metadata?.full_name;
    //for Adding users Email to the bookmarks table.

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
      setBookmark(bookmarkIconFilled);
      ToastAndroid.show("Bookmarked", ToastAndroid.SHORT);
    }
  };

  async function copyIconFunction() {
    Clipboard.setStringAsync(`${apiData?.text} - ${apiData?.author} `);
    ToastAndroid.show("Copied", ToastAndroid.SHORT);
  }

  function postIconFunction() {
    setPostIcon(downloadIconFilled);
    setTimeout(() => {
      setPostIcon(downloadIconOutline);
    }, 200);
  }

  function bookmarkCondition() {
    if (bookmark === bookmarkIconOutline) {
      bookmarkQuote();
    } else if (bookmark === bookmarkIconFilled) {
      setBookmark(bookmarkIconOutline);
      ToastAndroid.show("Bookmark Removed", ToastAndroid.SHORT);
    }
  }

  const fetchAPIData = async () => {
    const url = "https://stoic-quotes.com/api/quote";
    try {
      setBookmark(bookmarkIconOutline);
      setRefreshing(true);
      let urlResult = await fetch(url);
      let myData = await urlResult.json();
      setAPIData(myData);
      console.log(myData);
      setTimeout(() => {
        setRefreshing(false);
      }, 1);
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchAPIData();
    viewShotAnimations();
  }, []);

  async function quoteToPost() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    var post_id = Math.random();

    const userEmail = user?.email;
    const { data, error } = await supabase.from("Posts").insert({
      post: `${apiData?.text} - ${apiData?.author}`,
      post_id: post_id,
      email_id: userEmail,
    });
    if (error) {
      console.error(error);
    } else {
      postIconFunction();
      console.log("Quote To Post successful");
      ToastAndroid.show("Posted", ToastAndroid.SHORT);
    }
  }

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
      //playSound;
      ToastAndroid.show("Saved to rargallery", ToastAndroid.SHORT);
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
            <View>
              <TouchableOpacity onPress={reAnimCopy}>
                <Copy backgroundColor={animatedBgStyle.backgroundColor} />
              </TouchableOpacity>
              {showCopy && (
                <Animated.View
                  style={[{ position: "absolute" }, animatedStyle]}
                >
                  <Copy backgroundColor={animatedBgStyle.backgroundColor} />
                </Animated.View>
              )}
            </View>
            <Pressable
              style={universalStyles.icon}
              onPress={() => {
                bookmarkCondition();
              }}
            >
              {bookmark}
            </Pressable>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;
