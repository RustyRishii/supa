import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import universalStyles from "../../components/universalStyles";
//import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Community = () => {
  return (
    <SafeAreaView style={{ padding: 5 }}>
      <GestureHandlerRootView>
        <Text style={universalStyles.pageTitle}>Community</Text>
        <TextInput
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "black",
            padding: 10,
            color: "black",
          }}
          keyboardType="email-address"
          placeholder="Email"
        />
        <Image
          source={{ uri: "https://picsum.photos/seed/696/3000/2000" }}
          alt="Painting of mountains"
          height={500}
          width={400}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
  },
});
