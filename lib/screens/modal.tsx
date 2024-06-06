import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  var [postEnable, setPostEnable] = useState<boolean>(false);

  const postLengthLimit = 350;

  async function PostFunction() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    // from docs

    const userEmail = user?.email;
    var post_id = Math.random();

    if (post == "") {
      return;
    }
    const { data, error } = await supabase
      .from("Posts")
      .insert({ post, post_id: post_id, email_id: userEmail });
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

  //backgroundColor: "#878474"f

  return (
    <SafeAreaView
      style={{ padding: 5, backgroundColor: "gray", height: "100%" }}
    >
      <GestureHandlerRootView>
        <ScrollView>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{
                width: 30,
                height: 30,
              }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="close-outline" size={30} color={"white"} />
            </Pressable>
            <Pressable disabled={false} onPress={() => PostFunction()}>
              <Text style={universalStyles.postButton}>Post</Text>
            </Pressable>
          </View>
          <TextInput
            scrollEnabled={true}
            style={{
              fontSize: 20,
              color: "white",
            }}
            autoFocus={true}
            placeholderTextColor={"black"}
            selectionColor={"#5c4628"}
            value={post}
            onChangeText={(txt) => {
              setPost(txt);
              setWordCount(txt.length);
              if (txt.length > 0) {
                setPostEnable(true);
              }
            }}
            placeholder="Post something...."
            cursorColor={"black"}
            multiline={true}
            maxLength={postLengthLimit}
          />
          <View
            style={{
              alignItems: "flex-end",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>
              {wordCount}/{postLengthLimit}
            </Text>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Modal;

const styles = StyleSheet.create({});
