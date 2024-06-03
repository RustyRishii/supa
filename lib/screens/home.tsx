import { Pressable, StyleSheet, Text, View, ToastAndroid } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const copyIconFilled = <Icon name="copy" size={20} color={"black"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"black"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"black"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"black"} />
);

const Home = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmark, setBookmark] = useState(bookmarkIconOutline);
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

  function bookmarkCondition() {
    if (bookmark === bookmarkIconOutline) {
      setBookmark(bookmarkIconFilled);
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

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <StatusBar backgroundColor="black" style="light" />
      <GestureHandlerRootView>
        <ScrollView
          style={{ height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getQuotes} />
          }
        >
          <View style={universalStyles.quoteBlock}>
            {apiData ? (
              <View>
                <Text
                  selectable={true}
                  style={{ fontSize: 20, fontWeight: "bold" }}
                >
                  {apiData.text}
                </Text>
                <Text selectable={true} style={universalStyles.author}>
                  {apiData.author}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={universalStyles.bookmarkAndCopy}>
            <Pressable
              style={[
                {
                  height: 20,
                  width: 20,
                  //backgroundColor: "green",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => {
                copyIconFunction();
              }}
            >
              {copy}
            </Pressable>
            <Pressable
              style={{
                justifyContent: "center",
                height: 25,
                alignContent: "center",
                alignItems: "center",
                width: 25,
              }}
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

const styles = StyleSheet.create({});
