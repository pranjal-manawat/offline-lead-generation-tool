import React from "react";
import { StyleSheet, View } from "react-native";
import StudentRegistration from "./StudentRegistration";

export default function App() {
  return (
    <View style={styles.container}>
      <StudentRegistration />
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
