import { StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

interface BookmarkButtonProps {
  bookmarkCondition: () => void;
}

const BookmarkButton = ({ bookmarkCondition }: BookmarkButtonProps) => {
  const bookmarkIconFilled = (
    <Icon name="bookmark" size={20} color={"tomato"} />
  );

  return (
    <Pressable
      style={{
        marginTop: 10,
      }}
      onPress={bookmarkCondition}
    >
      {bookmarkIconFilled}
    </Pressable>
  );
};

export default BookmarkButton;

const styles = StyleSheet.create({});
