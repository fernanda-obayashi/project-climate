import { StyleSheet, View } from "react-native";
import Mood from "./src";

export default function App() {
  return (
    <View style={styles.container}>
      <Mood />
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
