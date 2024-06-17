import { Pressable, Text, View, ToastAndroid, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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

const copyIconFilled = <Icon name="copy" size={20} color={"#1D9BF0"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"white"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"#1D9BF0"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"aliceblue"} />
);

const postIconFilled = (
  <Icon name="arrow-forward-circle" size={20} color={"#1D9BF0"} />
);
const postIconOutline = (
  <Icon name="arrow-forward-circle-outline" size={20} color={"white"} />
);

const Home = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);
  const [postIcon, setPostIcon] = useState(postIconOutline);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [apiData, setAPIData] = useState<
    { text: string; author: string } | undefined
  >(undefined);

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
    } else {
      console.log("Text Data added successfully");
      setBookmark(bookmarkIconFilled);
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
    setPostIcon(postIconFilled);
    setTimeout(() => {
      setPostIcon(postIconOutline);
    }, 200);
  }

  function bookmarkCondition() {
    if (bookmark === bookmarkIconOutline) {
      bookmarkQuote();
      ToastAndroid.show("Bookmarked", ToastAndroid.SHORT);
    } else if (bookmark === bookmarkIconFilled) {
      setBookmark(bookmarkIconOutline);
      ToastAndroid.show("Bookmark Removed", ToastAndroid.SHORT);
    }
  }

  const fetchAPIData = async () => {
    const url = "https://stoic-quotes.com/api/quote";
    try {
      let urlResult = fetch(url);
      let myData = (await urlResult).json();
      setAPIData(await myData);
      console.log(myData);
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

  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");
  return (
    <SafeAreaView style={{}}>
      <StatusBar backgroundColor="black" style="light" />
      <GestureHandlerRootView>
        <ScrollView
          style={{
            height: viewportHeight - tabBarHeight,
            padding: 10,
            backgroundColor: "#243447",
          }}
          contentContainerStyle={{
            justifyContent: "center",
            flex: 1,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getQuotes} />
          }
        >
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
            <Pressable
              style={universalStyles.icon}
              onPress={() => quoteToPost()}
            >
              {postIcon}
            </Pressable>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;
