import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Community = () => {
  return (
    <SafeAreaView style={{ padding: 5 }}>
      <GestureHandlerRootView>
        <Text>community</Text>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({});
