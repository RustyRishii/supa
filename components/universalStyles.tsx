import { StyleSheet } from "react-native";
import { Colors } from "../lib/utlities/colors";

const universalStyles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    color: "white",
    paddingHorizontal: 5,
    borderBottomWidth: 0.2,
    borderColor: "aliceblue",
    backgroundColor: "#1E1E1E",
  },
  quoteBlock: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderColor: Colors.iconColor,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    borderWidth: 0.2,
    height: 215,
    paddingHorizontal: 10,
  },
  quote: {
    fontSize: 20,
    color: "aliceblue",
    flexWrap: "nowrap",
    //position: "relative",
  },
  author: {
    fontSize: 18,
    paddingTop: 10,
    alignContent: "flex-end",
    textAlign: "right",
    alignItems: "flex-end",
    color: "aliceblue",
    flexWrap: "nowrap",
    //position: "relative",
  },
  TextInput: {
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 5,
    color: "white",
    borderColor: "white",
  },
  LabelText: {
    marginTop: 20,
    marginBottom: 5,
    color: "white",
  },
  bookmarkAndCopy: {
    marginVertical: 10,
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
  authButtons: {
    backgroundColor: Colors.buttonColor,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  authButtonText: {
    fontSize: 20,
    color: "white",
  },
});

export default universalStyles;
