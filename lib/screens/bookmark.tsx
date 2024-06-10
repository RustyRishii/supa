import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ToastAndroid,
  Pressable,
  RefreshControl,
} from "react-native";
import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import universalStyles from "../../components/universalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { createClient } from "@supabase/supabase-js";
import { Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";

const copyIconFilled = <Icon name="copy" size={20} color={"#1D9BF0"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"white"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"#1D9BF0"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"black"} />
);

const Bookmark = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmarks, setBookmarks] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkIcon, setBookmarkIcon] = useState(bookmarkIconFilled);

  async function RefreshFunction() {
    setRefreshing(true);
    fetchBookmarks();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("Bookmarks")
      .select("id, Quote, Author");
    setBookmarks(data);
    console.log(data);

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }

    return data;
  }

  async function deleteBookmark(id: number) {
    const { data, error } = await supabase
      .from("Bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
    } else {
      console.log("Bookmark deleted successfully:", data);
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      fetchBookmarks();
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      RefreshFunction();
    }, [])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.item}>
      <Text
        accessible={true}
        accessibilityLabel="Quote and Author name"
        selectable={true}
        style={universalStyles.quote}
      >
        {item.Quote}
      </Text>

      <Text
        accessible={true}
        accessibilityLabel="Author name"
        selectable={true}
        style={universalStyles.author}
      >
        - {item.Author}
      </Text>

      <View style={{ flexDirection: "row", margin: 5 }}>
        <Pressable
          style={styles.icon}
          onPress={() => {
            setCopy(copyIconFilled);
            Clipboard.setString(`${item.Quote} - ${item.Author} `);
            ToastAndroid.show("Copied", ToastAndroid.SHORT);
            setTimeout(() => {
              setCopy(copyIconOutline);
            }, 200);
          }}
        >
          {copy}
        </Pressable>
        <Pressable onPress={() => deleteBookmark(item.id)}>
          {bookmarkIcon}
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ padding: 5, backgroundColor: "#243447" }}>
          <Text style={universalStyles.pageTitle}>Bookmarks</Text>
          <FlatList
            removeClippedSubviews={false}
            scrollEnabled={true}
            data={bookmarks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={RefreshFunction}
              />
            }
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 0.2,
    borderBottomColor: "aliceblue",
  },
  quote: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  author: {
    fontSize: 16,
    color: "black",
    fontStyle: "italic",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
  },
  icon: {
    height: 25,
    width: 50,
  },
});
