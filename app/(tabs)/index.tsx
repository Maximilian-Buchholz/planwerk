import { View, Text } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>
        Hello World 👋
      </Text>
    </View>
  );
}