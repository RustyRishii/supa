import { StyleSheet } from "react-native";

const universalStyles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
  },
  quoteBlock: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
    height: 215,
    paddingHorizontal: 10,
  },
  author: {
    fontSize: 20,
    paddingTop: 10,
    alignContent: "flex-end",
    textAlign: "right",
    alignItems: "flex-end",
  },
  bookmarkAndCopy: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default universalStyles;
