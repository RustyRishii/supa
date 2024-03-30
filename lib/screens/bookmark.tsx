import { Alert, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import universalStyles from "../../components/universalStyles";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("Bookmarks")
      .select("Quote, Author");

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }

    console.log(data);
    return data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBookmarks();
      setBookmarks(data);
    };

    fetchData();
  }, []);

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
            scrollEnabled={true}
            style={{ marginBottom: "15%" }}
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
