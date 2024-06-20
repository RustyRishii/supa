import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import universalStyles from "../../components/universalStyles";

const textSize = 25;
const CanvasPage = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  return (
    <SafeAreaView>
      <GestureHandlerRootView>
        <View
          style={{
            backgroundColor: "#243447",
            height: viewportHeight - tabBarHeight,
            paddingHorizontal: 5,
          }}
        >
          <Text style={universalStyles.pageTitle}>Canvas</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{}}
            contentContainerStyle={{}}
          >
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
            <Text style={{ fontSize: textSize }}>Canvas</Text>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default CanvasPage;

const styles = StyleSheet.create({});
