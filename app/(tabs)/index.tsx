import { Text, View } from "react-native";
import TaskCard from "../../components/taskcard";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F1E6" }}>
      <Text style={{ marginTop: 40, fontSize: 28, fontWeight: "bold" }}>
        PlanWerk 🚀
      </Text>


      <TaskCard />
    </View>
  );
}
