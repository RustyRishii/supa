import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
  Image,
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

const CommunityPage = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [post, setPost] = useState<any>([]);

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

  async function communityRefresh() {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  async function deleteData(id: number) {
    const { error } = await supabase.from("Posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
    } else {
      console.log("Post deleted successfully");
      // Refresh the posts after deletion
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
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          marginVertical: 10,
          paddingVertical: 5,
          paddingHorizontal: 5,
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
        <Text selectable={true} style={{ fontSize: 20, paddingHorizontal: 10 }}>
          {item.post}
        </Text>
        <Button title="Delete" onPress={() => deleteData} />
        <Text>{item.time_created}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View>
          <Text style={universalStyles.pageTitle}>Community</Text>
          <Text
            style={{
              fontSize: 50,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            Coming Soon
          </Text>
          {/* <FlatList
            scrollEnabled={true}
            removeClippedSubviews={false}
            data={post}
            renderItem={renderTweet}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 75 }}
            style={{ height: "100%" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={communityRefresh}
              />
            }
          /> */}
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
