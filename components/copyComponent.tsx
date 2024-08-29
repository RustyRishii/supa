import React from "react";
import { useState } from "react";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../lib/utlities/colors";
import * as Clipboard from "expo-clipboard";

const CopyButton = ({ text }: { text: string }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const bgColor = useSharedValue(Colors.pageBackgroundColor);

  const [showCopy, setShowCopy] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      backgroundColor: bgColor.value,
    };
  });

  const reAnimCopy = async () => {
    Clipboard.setStringAsync(text); //text is a parameter for respective pages.
    ToastAndroid.show("Copied", ToastAndroid.SHORT);

    if (!showCopy) {
      setShowCopy(true);

      translateX.value = withSpring(10);
      translateY.value = withSpring(10);
      scale.value = withSpring(1.2);
      //opacity.value = withTiming(0, { duration: 100 });
      bgColor.value = withTiming("tomato", { duration: 250 });
    }

    setTimeout(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      //opacity.value = withTiming(1, { duration: 100 });
      bgColor.value = withTiming(Colors.pageBackgroundColor, { duration: 250 });
      setShowCopy(false);
    }, 350);
  };

  return (
    <TouchableOpacity onPress={reAnimCopy}>
      <View style={{ position: "relative", height: 20, width: 20 }}>
        {/* Static copy icon */}
        <View
          style={{
            position: "absolute",
            height: 20,
            width: 20,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: Colors.iconColor,
            backgroundColor: Colors.pageBackgroundColor,
          }}
        />
        {/* Animated copy icon */}
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              height: 20,
              width: 20,
              borderWidth: 2,
              borderRadius: 5,
              borderColor: Colors.iconColor,
              backgroundColor: Colors.iconColor,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CopyButton;
