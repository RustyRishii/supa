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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              borderRadius: 10,
              borderWidth: 1,
              marginVertical: 10,
              height: 215,
              paddingHorizontal: 10,
            }}
          >
            {apiData ? (
              <View>
                <Text style={{ fontSize: 20 }}>{apiData.text}</Text>
                <Text
                  style={{
                    fontSize: 20,
                    paddingTop: 10,
                    alignContent: "flex-end",
                    textAlign: "right",
                    alignItems: "flex-end",
                  }}
                >
                  {apiData.author}
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Pressable
              style={{ height: 50, width: 50 }}
              onPress={() => {
                copyIconFunction();
              }}
            >
              {copy}
            </Pressable>
            <Pressable
              style={{ height: 50, width: 50 }}
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
