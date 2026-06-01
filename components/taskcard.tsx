import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Task = {
  id: string;
  title: string;
  project_name: string;
  due_date: string;
  done: boolean;
};

type Props = {
  task: Task;
  onUpdate: (updated: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [date, setDate] = useState(new Date(task.due_date));
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(task.done);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [projectName, setProjectName] = useState(task.project_name ?? "");

  const animHeight = useRef(new Animated.Value(0)).current;

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title,
        project_name: projectName,
        due_date: date.toISOString().split("T")[0],
      })
      .eq("id", task.id)
      .select()
      .single();

    if (!error && data) onUpdate(data);
    toggleExpand();
  };

  const toggleExpand = () => {
    Animated.timing(animHeight, {
      toValue: expanded ? 0 : 1,
      duration: 260,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const expandedHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={styles.card}>
      {/* Header */}
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
            <Text style={styles.date}>{date.toLocaleDateString("de-DE")}</Text>
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

          {/* Person + Datum Buttons */}
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
              <DateTimePicker
                value={date}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShow(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            </Pressable>
          </View>

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

          <Pressable style={styles.saveBtn} onPress={handleSave}>
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
    justifyContent: "center",
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

  bottomSheet: {
    flex: 1,
    justifyContent: "center",
  },
});
