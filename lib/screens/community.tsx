import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import universalStyles from "../../components/universalStyles";
//import { Image } from "expo-image";
import { supabase } from "../supabase";
import { FloatingAction } from "react-native-floating-action";
import { Icon } from "react-native-elements";

const Community = () => {
  const [task, setTask] = useState("");
  
  async function addTask() {
    if (task === "") {
      return;
    }

    const { error } = await supabase.from("Todo").insert({
      Task: task,
    });

    if (error) {
      console.error("Error adding task:", error.message);
      // Handle the error, show an error message, etc.
    } else {
      // Task added successfully, you can do something here if needed
      console.log("Task added successfully!");
      // Optionally, clear the input field after successful addition
      setTask("");
    }
  }

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
          value={task}
          onChangeText={(txt) => {
            setTask(txt);
            setTask;
          }}
        />
        <Button title="Submit" onPress={addTask} />
        {/* <Image
          source={{ uri: "https://picsum.photos/seed/696/3000/2000" }}
          alt="Painting of mountains"
          height={500}
          width={400}
        /> */}
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
