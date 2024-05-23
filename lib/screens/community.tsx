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
    const { error, data } = await supabase.from("Posts").select("post");
    setPost(data);
    console.log(data);

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return;
    }
    return data;
  }

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "1 Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "2 Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "3 Item",
    },
    {
      id: "abc",
      title: "4 Item",
    },
    {
      id: "-a4f8-fbd91aa97f63",
      title: "5 Item",
    },
    {
      id: "-471f-bd96-145571e29d72",
      title: "6 Item",
    },
    {
      id: "abcbhfhdvff",
      title: "7 Item",
    },
    {
      id: "-4f8-fbd91aa97f63",
      title: "8 Item",
    },
    {
      id: "471f-bd96-145571e29d72",
      title: "9 Item",
    },
    {
      id: "abcfhdvff",
      title: "10 Item",
    },
    {
      id: "-4fbd91aa97f63",
      title: "11 Item",
    },
    {
      id: "471f-145571e29d72",
      title: "12 Item",
    },
    {
      id: "abcdvff",
      title: "13 Item",
    },
    {
      id: "-4fbda97f63",
      title: "14 Item",
    },
    {
      id: "471f-1471e29d72",
      title: "15 Item",
    },
  ];

  async function communityRefresh() {
    setRefreshing(true);
    fetchPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }

  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View>
      <Text style={{ fontSize: 50 }}>{title}</Text>
    </View>
  );

  function modalPress () {
    
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View style={{ paddingHorizontal: 5 }}>
          <Text style={universalStyles.pageTitle}>Community</Text>
          <FlatList
            scrollEnabled={true}
            data={DATA}
            renderItem={({ item }) => <Item title={item.title} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 75 }}
            style={{ height: "100%" }}
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

/*
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
*/
