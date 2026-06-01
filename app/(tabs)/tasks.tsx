import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import TaskCard from "../../components/taskcard";

type Task = {
  id: string;
  title: string;
  project_name: string;
  due_date: string;
  done: boolean;
};

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState(false);

  // Formular-State
  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Aufgaben beim Start laden
  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setTasks(data);
    };
    fetchTasks();
  }, []);

  // Neue Aufgabe erstellen
  const handleCreate = async () => {
    if (!title.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        project_name: projectName,
        due_date: date.toISOString().split("T")[0],
      })
      .select()
      .single();

    console.log("data:", data);
    console.log("error:", error); // ← Was steht hier?
    // oben einfügen
    if (data) {
      setTasks((prev) => [data, ...prev]);
    }

    // Reset
    setTitle("");
    setProjectName("");
    setDate(new Date());
    setVisible(false);
  };

  // Task updaten (nach editieren)
  const handleUpdate = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Task löschen
  const handleDelete = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((tasks) => tasks.id !== id));
  };

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

        {/* Tasks aus der DB rendern */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
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
              <TextInput
                style={styles.input}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Projektname"
              />

              <Pressable onPress={() => setShow(true)} style={styles.metaBtn}>
                <Text>{date.toLocaleDateString("de-DE")}</Text>
              </Pressable>

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
                  onChange={(_, d) => {
                    setShow(false);
                    if (d) setDate(d);
                  }}
                />
              )}

              <Pressable style={styles.saveBtn} onPress={handleCreate}>
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
