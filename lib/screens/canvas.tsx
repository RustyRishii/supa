import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../utlities/colors";
import Animated, { withTiming } from "react-native-reanimated";
import { useSharedValue, withSpring } from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

const textSize = 50;
const CanvasPage = () => {
  const tabBarHeight = useBottomTabBarHeight();
  //const { height: viewportHeight } = Dimensions.get("window");
  const { height: viewportHeight, width: screenWidth } =
    Dimensions.get("window");

  const [refresing, setRefreshing] = useState<boolean>(false);
  const width = useSharedValue<number>(100);
  var borderWidths = useSharedValue(1);

  function onRefresh() {
    increaseWidth();
    borderWidthAnimation();
  }

  function borderWidthAnimation() {
    borderWidths.value = withTiming(borderWidths.value + 200, {
      duration: 500,
    });
    setTimeout(() => {
      borderWidths.value = withTiming(1, {
        duration: 500,
      });
    }, 500);
  }

  function increaseWidth() {
    if (width.value <= screenWidth) {
      width.value = withTiming(width.value + 25, { duration: 500 });
    } else {
      width.value = withSpring(screenWidth);
      ToastAndroid.show("Max width limit reached", ToastAndroid.SHORT);
    }
  }

  return (
    <SafeAreaView>
      <GestureHandlerRootView>
        <View
          style={{
            backgroundColor: "grey",
            height: viewportHeight - tabBarHeight,
            paddingHorizontal: 5,
            alignContent: "center",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            style={{
              alignContent: "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refresing} onRefresh={onRefresh} />
            }
          >
            <ViewShot>
              <Animated.View
                style={{
                  margin: 10,
                  width: width,
                  borderRadius: 10,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                  backgroundColor: "tomato",
                  elevation: 100,
                }}
              />
            </ViewShot>

            <Animated.View
              style={{
                width: "100%",
                height: 200,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderColor: "maroon",
                margin: 10,
                borderLeftWidth: borderWidths,
                borderTopWidth: 1,
                borderRightWidth: borderWidths,
                borderBottomWidth: 1,
                borderRadius: 10,
                //padding: borderWidths,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Animation test
              </Text>
            </Animated.View>
            <Animated.View
              style={{
                width: "100%",
                height: 200,
                borderLeftWidth: 1,
                borderTopWidth: borderWidths,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderColor: "maroon",
                margin: 10,
                borderRadius: 10,
                //padding: 10,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Animated View</Text>
            </Animated.View>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default CanvasPage;

const styles = StyleSheet.create({});
