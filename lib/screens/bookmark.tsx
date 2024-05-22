import {
  Alert,
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

const copyIconFilled = <Icon name="copy" size={20} color={"black"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"black"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"black"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"black"} />
);

const Bookmark = () => {
  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmarkIcon, setBookmarkIcon] = useState(bookmarkIconFilled);
  const [bookmarks, setBookmarks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("Bookmarks")
      .select("Quote, Author");
    setBookmarks(data);
    console.log(data);

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }

    return data;
  }

  async function RefreshFunction() {
    setRefreshing(true);
    fetchBookmarks();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  // useEffect(() => {
  //   RefreshFunction();
  //   console.log("UseEffect Run done");
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      RefreshFunction();
    }, [])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.item}>
      <Text selectable={true} style={styles.quote}>
        {item.Quote}
      </Text>
      <Text selectable={true} style={styles.author}>
        - {item.Author}
      </Text>
      <View style={{ flexDirection: "row" }}>
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
        {/* <Pressable style={styles.icon} onPress={() => deleteBookmarks()}>
          {bookmarkIcon}
        </Pressable> */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ padding: 5 }}>
          <Text style={universalStyles.pageTitle}>Bookmarks</Text>
          <RefreshControl refreshing={refreshing} onRefresh={RefreshFunction}>
            <FlatList
              scrollEnabled={true}
              data={bookmarks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 120 }}
              style={{ height: "100%" }}
            />
          </RefreshControl>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // marginBottom: 30,
  },
  quote: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 5,
  },
  author: {
    fontSize: 16,
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

{
  /*  */
}

/*
function copyIconFunction() {
            setCopy(copyIconFilled);
            Clipboard.setString(`${item.Quote} - ${item.Author} `);
            ToastAndroid.show("Copied", ToastAndroid.SHORT);
            setTimeout(() => {
              setCopy(copyIconOutline);
            }, 200);
          }
          */

/*
<SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ padding: 10 }}>
          <Text style={universalStyles.pageTitle}>Bookmarks</Text>
          <View>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={RefreshFunction}
                />
              }
              scrollEnabled={true}
              contentContainerStyle={{ paddingBottom: 60 }}
              style={{ height: "100%" }}
              data={bookmarks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
*/
