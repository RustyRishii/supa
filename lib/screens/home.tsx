import {
  Pressable,
  Text,
  View,
  ToastAndroid,
  Dimensions,
  Alert,
  Image,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import Clipboard from "@react-native-clipboard/clipboard";
import { supabase } from "../supabase";
import universalStyles from "../../components/universalStyles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";
import { request, PERMISSIONS } from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";

const copyIconFilled = <Icon name="copy" size={20} color={"#1D9BF0"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"white"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"#1D9BF0"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"aliceblue"} />
);

const downloadIconFilled = <Icon name="download" size={20} color={"#1D9BF0"} />;
const downloadIconOutline = (
  <Icon name="download-outline" size={20} color={"white"} />
);

const Home = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);
  const [postIcon, setPostIcon] = useState(downloadIconOutline);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(true);
  const [apiData, setAPIData] = useState<
    { text: string; author: string } | undefined
  >(undefined);

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

  function netCheck() {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        ToastAndroid.show("No internet", ToastAndroid.SHORT);
      }
    });
  }
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
    //for Adding users Email to the bookmarks table.

    const { data, error } = await supabase.from("Bookmarks").insert({
      Quote: apiData?.text,
      Author: apiData?.author,
      email_id: userEmail,
    });
    if (error) {
      console.error(error);
      ToastAndroid.show("No internet", ToastAndroid.SHORT);
    } else {
      console.log("Bookmarked");
      setBookmark(bookmarkIconFilled);
      ToastAndroid.show("Bookmarked", ToastAndroid.SHORT);
    }
  };

  function copyIconFunction() {
    setCopy(copyIconFilled);
    Clipboard.setString(`${apiData?.text} - ${apiData?.author} `);
    ToastAndroid.show("Copied", ToastAndroid.SHORT);
    setTimeout(() => {
      setCopy(copyIconOutline);
    }, 200);
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
      let urlResult = await fetch(url); // Added 'await'
      let myData = await urlResult.json(); // Added 'await'
      setAPIData(myData);
      console.log(myData); // This should only log once
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  const getQuotes = useCallback(() => {
    setBookmark(bookmarkIconOutline);
    setRefreshing(true);
    fetchAPIData();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  useEffect(() => {
    getQuotes();
  }, [getQuotes]); // Added 'getQuotes' to the dependency array

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

  const viewShotRef = useRef();

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

  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");
  return (
    <SafeAreaView style={{}}>
      <StatusBar backgroundColor="black" style="light" />
      <GestureHandlerRootView>
        <ScrollView
          style={{
            backgroundColor: "#243447",
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
                getQuotes();
                netCheck();
              }}
            />
          }
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 1.0, height: 215 }}
            style={{ backgroundColor: "#243447" }}
          >
            <TouchableNativeFeedback onLongPress={handleLongPress}>
              <View style={universalStyles.quoteBlock}>
                {apiData ? (
                  <View>
                    <Text selectable={true} style={universalStyles.quote}>
                      {apiData.text}
                    </Text>
                    <Text selectable={true} style={universalStyles.author}>
                      - {apiData.author}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableNativeFeedback>
          </ViewShot>

          <View style={universalStyles.bookmarkAndCopy}>
            <Pressable
              style={universalStyles.icon}
              onPress={() => {
                copyIconFunction();
              }}
            >
              {copy}
            </Pressable>
            <Pressable
              style={universalStyles.icon}
              onPress={() => {
                bookmarkCondition();
              }}
            >
              {bookmark}
            </Pressable>
            {/* <Pressable
              style={universalStyles.icon}
              onPress={() => quoteToPost()}
            >
              {postIcon}
            </Pressable> */}
          </View>
          {/* 
          <View>
            {isConnected ? <Text>Online</Text> : <Text>Offline</Text>}
          </View> */}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;
