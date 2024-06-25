import React, { useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";
import { request, PERMISSIONS } from "react-native-permissions";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import universalStyles from "../../components/universalStyles";

const textSize = 25;
const CanvasPage = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { height: viewportHeight } = Dimensions.get("window");

  const viewShotRef = useRef();

  const handleLongPress = async () => {
    try {
      // Request permissions if needed
      const permission = await request(
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      );

      if (permission !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot save screenshot without permission"
        );
        return;
      }

      // Capture screenshot
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      const destPath = `${
        RNFS.PicturesDirectoryPath
      }/screenshot_${Date.now()}.png`;
      await RNFS.moveFile(uri, destPath);

      ToastAndroid.show("Saved to gallery", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Error", "An error occurred while taking the screenshot");
      console.error(error);
    }
  };

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
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 1.0, height: 215 }}
          >
            <TouchableWithoutFeedback onLongPress={handleLongPress}>
              <View style={universalStyles.quoteBlock}>
                <Text selectable={true} style={universalStyles.quote}>
                  Forget everything else. Keep hold of this alone and remember
                  it: Each of us lives only now, this brief instant. The rest
                  has been lived already, or is impossible to see. The span we
                  live is small—small.
                </Text>
                <Text selectable={true} style={universalStyles.author}>
                  - Marcus Aurelius
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ViewShot>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default CanvasPage;

const styles = StyleSheet.create({});
