import { StyleSheet, Text, View } from "react-native";
import React from "react";
import universalStyles from "./universalStyles";

const LabelText = ({ LabelText }: { LabelText: string }) => {
  return <Text style={universalStyles.LabelText}>{LabelText}</Text>;
};

export default LabelText;

const styles = StyleSheet.create({});
