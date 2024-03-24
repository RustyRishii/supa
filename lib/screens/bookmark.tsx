import { Alert, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

const Bookmark = () => {
  const tableName = "Bookmarks";

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.error("Error fetching todos:", error.message);
        return;
      }

      setData(data);
    };

    fetchData();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    return <Text style={styles.item}>{item.text}</Text>;
  };

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];

  
  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <GestureHandlerRootView>
        <View>
          <Text>Bookmarks</Text>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <FlatList
            data={DATA}
            renderItem={({ item }) => <Item title={item.title} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 32,
  },
});
