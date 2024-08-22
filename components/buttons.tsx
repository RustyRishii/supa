import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import universalStyles from "./universalStyles";

type ButtonProps = {
  text: string;
  onPress: () => void; // Function to handle the press event
};

const Button = ({ text, onPress }: ButtonProps) => {
  return (
    <Pressable onPress={onPress} style={universalStyles.authButtons}>
      <Text style={universalStyles.authButtonText}>{text}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});
