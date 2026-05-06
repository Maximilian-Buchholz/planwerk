import { View, Text } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        PlanWerk 🚀
      </Text>

      <Text style={{ marginTop: 10 }}>
        Dein Projektmanagement Dashboard
      </Text>
    </View>
  );
}