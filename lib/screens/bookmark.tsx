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

const copyIconFilled = <Icon name="copy" size={20} color={"black"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"black"} />;

const Bookmark = () => {
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
  //   fetchBookmarks();
  // }, [200]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text selectable={true} style={styles.quote}>
        {item.Quote}
      </Text>
      <Text selectable={true} style={styles.author}>
        - {item.Author}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ padding: 10 }}>
          <Text style={universalStyles.pageTitle}>Bookmarks</Text>
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
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  quote: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
  },
});

{
  /*  */
}
