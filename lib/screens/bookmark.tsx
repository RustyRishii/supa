import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ToastAndroid,
  Dimensions,
  Pressable,
  RefreshControl,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../utlities/supabase";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import React from "react";
import universalStyles from "../../components/universalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import NetInfo from "@react-native-community/netinfo";
//FFA500
const copyIconFilled = <Icon name="copy" size={20} color={"tomato"} />;
const copyIconOutline = <Icon name="copy-outline" size={20} color={"tomato"} />;

const bookmarkIconFilled = <Icon name="bookmark" size={20} color={"tomato"} />;
const bookmarkIconOutline = (
  <Icon name="bookmark-outline" size={20} color={"tomato"} />
);

const Bookmark = () => {
  const { height: viewportHeight } = Dimensions.get("window");
  const tabBarHeight = useBottomTabBarHeight();

  const [copy, setCopy] = useState(copyIconOutline);
  const [bookmarks, setBookmarks] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkIcon, setBookmarkIcon] = useState(bookmarkIconFilled);
  const [isConnected, setConnected] = useState<boolean>(true);

  async function RefreshFunction() {
    setRefreshing(true);
    fetchBookmarks();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  function netCheck() {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setConnected(false);
        ToastAndroid.show("No internet", ToastAndroid.SHORT);
      }
      if (state.isConnected) {
        setConnected(true);
      }
    });
  }

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("Bookmarks")
      .select("id, Quote, Author");
    setBookmarks(data);
    //console.log(data);

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
      netCheck();
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
        <Pressable onPress={() => deleteBookmark(item.id)}>
          {bookmarkIcon}
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            //paddingHorizontal: 5,
            //marginHorizontal: 5,
            backgroundColor: "#121212",
            height: viewportHeight - tabBarHeight,
          }}
        >
          <View style={{ backgroundColor: "#1E1E1E" }}>
            <Text style={universalStyles.pageTitle}>Bookmarks</Text>
          </View>
          {isConnected ? (
            <FlatList
              removeClippedSubviews={false}
              scrollEnabled={true}
              data={bookmarks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ height: "100%" }}
              indicatorStyle="white"
              snapToEnd={true}
              showsVerticalScrollIndicator={true}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    RefreshFunction();
                    netCheck();
                  }}
                />
              }
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 45,
                  color: "red",
                  textAlign: "center",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                No internet
              </Text>
            </View>
          )}
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
    padding: 5,
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

// const viewShotRef = useRef();

//   const handleLongPress = async () => {
//     try {
//       // Request permissions if needed
//       const permission = await request(
//         Platform.OS === "ios"
//           ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
//           : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
//       );

//       if (permission !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Cannot save screenshot without permission"
//         );
//         return;
//       }

//       // Capture screenshot
//       const uri = await viewShotRef.current.capture();

//       // Save to gallery
//       const destPath = `${
//         RNFS.PicturesDirectoryPath
//       }/screenshot_${Date.now()}.png`;
//       await RNFS.moveFile(uri, destPath);

//       ToastAndroid.show("Saved to gallery", ToastAndroid.SHORT);
//     } catch (error) {
//       Alert.alert("Error", "An error occurred while taking the screenshot");
//       console.error(error);
//     }
//   };
