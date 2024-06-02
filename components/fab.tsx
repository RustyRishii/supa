import { StyleSheet, Pressable, Text, View } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";
import universalStyles from "./universalStyles";

const Fab = ({ navigation }: { navigation: any }) => {
  return (
    <Pressable onPress={() => navigation.navigate("Modal")} style={styles.fab}>
      <Icon
        name="add-circle"
        color={universalStyles.buttonBgColor.color}
        size={65}
      />
    </Pressable>
  );
};

export default Fab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50, // half of the size of the icon (75/2)
    width: 75,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
