//@refresh reset
import NetInfo from "@react-native-community/netinfo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import BookmarkButton from "../../components/interactionButons/bookmarkIcon";

const Bookmark = () => {
  const { height: viewportHeight, width: screenWidth } =
    Dimensions.get("window");
  const tabBarHeight = useBottomTabBarHeight();

  const [bookmarks, setBookmarks] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setConnected] = useState<boolean>(true);
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bookmarks",
        },
        (payload) => {
          console.log(payload);
          // Update bookmark count based on the change
          getBookmarkCount().then((count) => setBookmarkCount(count));
          // Also refresh the bookmarks list
          fetchBookmarks();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getBookmarkCount(): Promise<number | null> {
    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return null;
      }

      const email = user?.email; // This is your dynamic email

      if (!email) {
        console.error("No user email found.");
        return null;
      }

      const { data, error } = await supabase
        .from("Bookmarks")
        .select("id", { count: "exact" })
        .eq("email_id", email);

      if (error) {
        console.error("Error fetching bookmark count:", error);
        return null;
      }

      return data.length;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    }
  }

  async function RefreshFunction() {
    setRefreshing(true);
    fetchBookmarks();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  async function netCheck() {
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
    const { error } = await supabase.from("Bookmarks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
    } else {
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      // The real-time subscription will handle updating the list and count
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

  useEffect(() => {
    const fetchBookmarkCount = async () => {
      const count = await getBookmarkCount();
      setBookmarkCount(count);
    };

    fetchBookmarkCount();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      RefreshFunction();
      netCheck();
    }, [])
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
          <View
            style={{
              backgroundColor: "#1E1E1E",
              //backgroundColor: "green",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={universalStyles.pageTitle}>
              Bookmarks: {bookmarkCount !== null ? bookmarkCount : "None"}{" "}
            </Text>
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
