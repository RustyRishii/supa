import React, { useState, useRef } from "react";
import LottieView from "lottie-react-native";
import {
  DimensionValue,
  StyleProp,
  ToastAndroid,
  TouchableNativeFeedback,
} from "react-native";
import * as Clipboard from "expo-clipboard";

const CopyButton = ({
  text,
  width,
  height,
}: {
  text: string;
  width: DimensionValue;
  height: DimensionValue;
}) => {
  const [lastCopiedText, setLastCopiedText] = useState<string | null>(null);
  const bookMarkLottieRef = useRef<LottieView>(null);

  return (
    <TouchableNativeFeedback
      onPress={() => {
        if (lastCopiedText !== text) {
          Clipboard.setStringAsync(text);
          ToastAndroid.show("Copied", ToastAndroid.SHORT);
          setLastCopiedText(text);
        }
        bookMarkLottieRef.current!.play();
      }}
    >
      <LottieView
        ref={bookMarkLottieRef}
        style={{ width: width, height: height }} // Same size as CopyButton
        source={require("../../assets/animations/copy.json")}
        loop={false}
      />
    </TouchableNativeFeedback>
  );
};

export default CopyButton;
