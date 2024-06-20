import { StyleSheet, Dimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const universalStyles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    color: "white",
    borderBottomWidth: 0.2,
    borderColor: "aliceblue",
  },

  quoteBlock: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 0.2,
    marginVertical: 10,
    height: 215,
    paddingHorizontal: 10,
  },
  quote: {
    fontSize: 20,
    color: "aliceblue",
  },
  author: {
    fontSize: 18,
    paddingTop: 10,
    alignContent: "flex-end",
    textAlign: "right",
    alignItems: "flex-end",
    color: "aliceblue",
  },
  TextInput: {
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 5,
    borderColor: "black",
  },
  ReferenceText: {
    marginTop: 20,
    marginBottom: 5,
  },
  bookmarkAndCopy: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonBgColor: {
    color: "#1D9BF0",
  },
  universalColors: {
    backgroundColor: "#243447",
  },
  postButton: {
    color: "white",
    backgroundColor: "#5c4628",
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 50,
  },
  icon: {
    height: 25,
    width: 25,
    color: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default universalStyles;
