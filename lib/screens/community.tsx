import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  GestureHandlerRootView,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import universalStyles from "../../components/universalStyles";
// import { Image } from "expo-image";
import { supabase } from "../supabase";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import Fab from "../../components/fab";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const CommunityPage = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [post, setPost] = useState<any>([]);

  async function communityRefresh() {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  async function fetchPosts() {
    const { error, data } = await supabase
      .from("Posts")
      .select("id, post , time_created ");
    setPost(data);
    console.log(data);
    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }
    return data;
  }

  async function deletePosts(id: number) {
    const { data, error } = await supabase.from("Posts").delete().eq("id", id);
    if (error) {
      console.error();
    } else {
      console.log("Post delete successfully", data);
      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      communityRefresh();
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      communityRefresh();
    }, [])
  );

  const renderTweet = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          //borderWidth: 1,
          borderBottomWidth: 1,
          borderRadius: 10,
          borderColor: "white",
          padding: 5,
          flexWrap: "wrap",
        }}
      >
        <Pressable onPress={() => console.log("Image pressed")}>
          <Image
            width={35}
            height={35}
            style={{ backgroundColor: "gray" }}
            borderRadius={50}
            source={{
              uri: "https://hlgnifpdoxwdaezhvlru.supabase.co/storage/v1/object/public/User%20Profile/pfp/pfp.png",
            }}
          />
        </Pressable>
        <Text
          selectable={true}
          style={{ fontSize: 20, paddingHorizontal: 10, color: "aliceblue" }}
        >
          {item.post}
        </Text>
        <Button title="Delete" onPress={() => deletePosts(item.id)} />
        <Text style={{ color: "aliceblue" }}>{item.time_created}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        //padding: 5,
        backgroundColor: "#243447",
        height: viewportHeight - tabBarHeight,
      }}
    >
      <GestureHandlerRootView>
        <View style={{ height: viewportHeight - tabBarHeight }}>
          <Text style={universalStyles.pageTitle}>Community</Text>
          <FlatList
            scrollEnabled={true}
            removeClippedSubviews={false}
            data={post}
            renderItem={renderTweet}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={communityRefresh}
              />
            }
          />
        </View>
        <Pressable
          onPress={() => navigation.navigate("Modal")}
          style={styles.fab}
        >
          <Icon
            name="add-circle"
            color={universalStyles.buttonBgColor.color}
            size={65}
          />
        </Pressable>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default CommunityPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 5,
  },
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50, // half of the size of the icon (75/2)
    width: 75,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
