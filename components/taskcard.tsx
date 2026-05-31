import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TaskCard() {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("Aufgabenname");
  const [projectName, setProjectName] = useState("Projekt");

  const animHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animHeight, {
      toValue: expanded ? 0 : 1,
      duration: 260,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  // Größe beim Aufklappen bestimmen
  const expandedHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={styles.card}>
      {/* Header — antippen zum Expandieren */}
      <Pressable onPress={toggleExpand}>
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Pressable
              onPress={() => setDone(!done)}
              style={styles.radioWrapper}
            >
              <View style={[styles.radio, done && styles.radioDone]} />
            </Pressable>
            <View style={styles.textBlock}>
              <Text style={[styles.title, done && styles.titleDone]}>
                {title}
              </Text>
              <Text style={styles.sub}>{projectName}</Text>
            </View>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.date}>15 Jun</Text>
          </View>
        </View>
      </Pressable>

      {/* Expandierter Bereich */}
      <Animated.View style={{ height: expandedHeight, overflow: "hidden" }}>
        <View style={styles.editArea}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titel"
          />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={() => console.log("Person auswählen")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "#3dd6f5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>ma</Text>
              </View>
              <Text style={{ color: "#fff" }}>max</Text>
            </Pressable>

            <Pressable
              onPress={() => console.log("Datum auswählen")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: "#e0e0e0",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>📅</Text>
              <Text style={{ color: "#888" }}>Datum</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Projektname"
          />
          <Text style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Beschreibung
          </Text>
          <TextInput
            multiline
            style={{
              textAlignVertical: "top", // ← Android
              padding: 10,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 10,
              height: 140,
            }}
          />
          <Pressable style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Speichern</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
  },

  radioDone: {
    backgroundColor: "#4ff75d34",
    borderColor: "#999",
  },

  title: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  titleDone: {
    color: "#888",
  },

  sub: {
    color: "#565656",
    fontSize: 12,
    marginTop: 4,
  },

  radioWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  textBlock: {
    justifyContent: "center",
  },

  date: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "DMMono_Regular",
  },

  dateBox: {
    backgroundColor: "#a9a9a9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    opacity: 0.5,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  editArea: {
    marginTop: 14,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#000",
  },
  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  assignBox: {},
});
