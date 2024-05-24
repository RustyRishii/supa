import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabase";
import universalStyles from "../../components/universalStyles";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";

const Modal = ({ navigation }: { navigation: any }) => {
  const [post, setPost] = useState<string>("");
  var [wordCount, setWordCount] = useState(0);

  async function PostFunction() {
    if (post == "") {
      return;
    }
    const { error } = await supabase.from("Posts").insert({ post });
    navigation.goBack();

    if (error) {
      console.error("Error adding task:", error.message);
      // Handle the error, show an error message, etc.
    } else {
      // Task added successfully, you can do something here if needed
      console.log("Task added successfully!");
      // Optionally, clear the input field after successful addition
      setPost("");
    }
  }

  //backgroundColor: "#878474"

  return (
    <SafeAreaView
      style={{ padding: 5, backgroundColor: "gray", height: "100%" }}
    >
      <GestureHandlerRootView>
        <ScrollView>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <Pressable
              style={{
                //justifyContent: "flex-start",
                width: 35,
                height: 30,
                //backgroundColor: "green",
              }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close-outline" size={40} color={"white"} />
            </Pressable>
            <Text>{wordCount}/300</Text>
            <Pressable onPress={() => PostFunction()}>
              <Text style={universalStyles.postButton}>Post</Text>
            </Pressable>
          </View>
          <TextInput
            style={{
              fontSize: 25,
              color: "white",
            }}
            selectionColor={"#5c4628"}
            value={post}
            onChangeText={(txt) => {
              setPost(txt);
              setWordCount(txt.length);
            }}
            placeholder="Post something...."
            cursorColor={"black"}
            multiline={true}
            maxLength={350}
          />
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Modal;

const styles = StyleSheet.create({});
