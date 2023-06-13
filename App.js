import React from "react";
import { StyleSheet, View } from "react-native";
import StudentRegistration from "./StudentRegistration";
import OCRComponent from "./OCRComponent";
import VisitingCardScanner from "./VisitingCardScanner";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <OCRComponent/> */}
      <VisitingCardScanner/>
      {/* <StudentRegistration /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
