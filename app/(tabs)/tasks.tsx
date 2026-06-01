import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import TaskCard from "../../components/taskcard";

export default function Index() {
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

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

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        <Pressable onPress={() => setVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sort</Text>
        </Pressable>
      </View>

      {/* MODAL / BOTTOM SHEET */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Neue Aufgabe</Text>

            <View style={styles.editArea}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Titel"
              />

              {/* META ROW */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => console.log("Person auswählen")}
                  style={styles.metaBtn}
                >
                  <View style={styles.avatar}>
                    <Text style={{ fontSize: 12, fontWeight: "600" }}>ma</Text>
                  </View>
                  <Text style={styles.metaBtnText}>max</Text>
                </Pressable>

                <Pressable onPress={() => setShow(true)} style={styles.metaBtn}>
                  <Text style={styles.metaBtnText}>
                    {date.toLocaleDateString("de-DE")}
                  </Text>
                </Pressable>
              </View>

              {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShow(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <TextInput
                style={styles.input}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Projektname"
              />

              <Text style={styles.label}>Beschreibung</Text>

              <TextInput
                multiline
                style={styles.textArea}
                textAlignVertical="top"
                placeholder="Hier tippen..."
              />

              <Pressable
                style={styles.saveBtn}
                onPress={() => {
                  console.log({
                    title,
                    projectName,
                    date,
                  });

                  setVisible(false);
                }}
              >
                <Text style={styles.saveBtnText}>Speichern</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: "white" }}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    backgroundColor: "white",
    padding: 20,
    height: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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

  metaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
  },

  metaBtnText: {
    fontSize: 14,
    color: "#000",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3dd6f5",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
    height: 140,
    fontSize: 14,
    color: "#000",
  },

  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    marginTop: 4,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  closeButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
