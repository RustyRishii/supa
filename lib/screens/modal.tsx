import { Pressable, StyleSheet, Text, View } from "react-native";
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

  return (
    <SafeAreaView
      style={{ padding: 5, backgroundColor: "#878474", height: "100%" }}
    >
      <GestureHandlerRootView>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
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
          <Pressable onPress={() => PostFunction()}>
            <Text style={universalStyles.postButton}>Post</Text>
          </Pressable>
        </View>
        <TextInput
          style={universalStyles.TextInput}
          value={post}
          onChangeText={(txt) => {
            setPost(txt);
            setPost;
          }}
          placeholder="Post something"
          cursorColor={"black"}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Modal;

const styles = StyleSheet.create({});
