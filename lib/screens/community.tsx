import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
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
import { Icon } from "react-native-elements";

const CommunityPage = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [post, setPost] = useState([]);

  async function fetchPosts() {
    const { error, data } = await supabase
      .from("Posts")
      .select("post, time_created");

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }

    return data;
  }

  async function communityRefresh() {}

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView style={styles.container}>
        <Text style={universalStyles.pageTitle}>Community</Text>
        <RefreshControl onRefresh={} refreshing={true}>
          <FlatList />
        </RefreshControl>
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
    borderRadius: 37.5, // half of the size of the icon (75/2)
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
