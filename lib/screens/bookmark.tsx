import NetInfo from "@react-native-community/netinfo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import universalStyles from "../../components/universalStyles";
import { Colors } from "../utlities/colors";
import { supabase } from "../utlities/supabase";
import CopyButton from "../../components/interactionButons/copyComponent";
import LottieView from "lottie-react-native";
import BookmarkButton from "../../components/interactionButons/bookmarkIcon";

const Bookmark = () => {
  const { height: viewportHeight, width: screenWidth } =
    Dimensions.get("window");
  const tabBarHeight = useBottomTabBarHeight();

  const [bookmarks, setBookmarks] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setConnected] = useState<boolean>(true);

  const bookMarkLottieRef = useRef<LottieView>(null);

  useFocusEffect(
    React.useCallback(() => {
      RefreshFunction();
      netCheck();
      // Set the animation to the last frame when the component is focused
      if (bookMarkLottieRef.current) {
        bookMarkLottieRef.current.play(0, 60); // Adjust this number according to the number of frames in the animation
      }
    }, [])
  );

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
      } else {
        setConnected(true);
      }
    });
  }

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("Bookmarks")
      .select("id, Quote, Author")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }
    setBookmarks(data);
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

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View
      style={{
        borderBottomWidth: 0.2,
        borderBottomColor: "aliceblue",
        padding: 5,
      }}
    >
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
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 1,
          justifyContent: "space-between",
          width: 90,
        }}
      >
        <CopyButton
          height={40}
          width={30}
          text={`${item.Quote} - ${item.Author}`}
        />
        {/* <TouchableNativeFeedback
          onPress={() => {
            deleteBookmark(item.id);
            if (bookMarkLottieRef.current) {
              bookMarkLottieRef.current.play(0, 60); // Plays the animation from start to end
            }
          }}
        >
          <LottieView
            ref={bookMarkLottieRef}
            style={{ width: 40, height: 40 }} // Same size as CopyButton
            source={require("../../assets/bookmark.json")}
            loop={false}
            speed={-1}
          />
        </TouchableNativeFeedback> */}
        {/* <Pressable
          style={{
            marginTop: 10,
          }}
          onPress={() => deleteBookmark(item.id)}
        >
          {bookmarkIconFilled}
        </Pressable> */}
        <BookmarkButton bookmarkCondition={() => deleteBookmark(item.id)} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            backgroundColor: Colors.pageBackgroundColor,
            height: viewportHeight - tabBarHeight,
          }}
        >
          <View style={{ backgroundColor: "#1E1E1E" }}>
            <Text style={universalStyles.pageTitle}>Bookmarks</Text>
          </View>
          {isConnected ? (
            <FlatList
              removeClippedSubviews={false}
              data={bookmarks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ height: "100%" }}
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
            <View style={styles.noInternetView}>
              <Text style={styles.noInternetText}>No internet</Text>
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noInternetView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noInternetText: {
    color: "red",
    fontSize: 45,
    textAlign: "center",
  },
});

export default Bookmark;
