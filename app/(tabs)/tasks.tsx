import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import TaskCard from "../../components/taskcard";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            marginTop: 40,
            marginBottom: 20,
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          PlanWerk 🚀
        </Text>

        <TaskCard />
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sort</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    position: "absolute",
    bottom: 15, // über TabBar

    alignSelf: "center",

    flexDirection: "row",
    gap: 0,

    backgroundColor: "#000000",
    padding: 5,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  button: {
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
