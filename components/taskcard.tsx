import { formatDueDate } from "@/lib/date";
import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
  Alert,
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

  const handleDelete = () => {
    Alert.alert(
      "Aufgabe löschen",
      "Möchtest du diese Aufgabe wirklich löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: () => onDelete(task.id),
        },
      ]
    );
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
    outputRange: [0, 460],
  });

  const dueInfo = formatDueDate(task.due_date);

  return (
    <View style={styles.card}>
      {/* Header */}
      <Pressable onPress={toggleExpand}>
        <View style={styles.row}>
          <Pressable onPress={() => setDone(!done)} style={styles.checkboxTap}>
            <View style={[styles.checkbox, done && styles.checkboxChecked]}>
              {done && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </Pressable>
          <View style={styles.textBlock}>
            <Text style={[styles.title, done && styles.titleDone]}>
              {title}
            </Text>
            <Text
              style={[
                styles.due,
                !done && dueInfo.isDueOrOverdue && styles.dueSoon,
              ]}
            >
              {dueInfo.label} · {dueInfo.relative}
            </Text>
            {!!projectName && <Text style={styles.sub}>{projectName}</Text>}
          </View>
        </View>
        <View style={styles.chevronRow}>
          <Text style={styles.chevron}>{expanded ? "︿" : "﹀"}</Text>
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
            placeholderTextColor="#B9B4A9"
          />

          {/* Person + Datum Buttons */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={() => console.log("Person auswählen")}
              style={styles.metaBtn}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>ma</Text>
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
            placeholderTextColor="#B9B4A9"
          />

          <Text style={styles.label}>Beschreibung</Text>
          <TextInput
            multiline
            style={styles.textArea}
            textAlignVertical="top"
            placeholder="Hier tippen..."
            placeholderTextColor="#B9B4A9"
          />

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>SPEICHERN</Text>
          </Pressable>

          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>LÖSCHEN</Text>
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
    borderRadius: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkboxTap: {
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#DBD5C8",
    backgroundColor: "#F5F2EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#E4DFD3",
    borderColor: "#C9C2B2",
  },
  checkmark: {
    color: "#3B3B3B",
    fontSize: 14,
    fontWeight: "700",
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "DMSans_Medium",
    color: "#1D1D1B",
    fontSize: 17,
  },
  titleDone: {
    color: "#B0AB9F",
    textDecorationLine: "line-through",
  },
  due: {
    fontFamily: "DMMono_Regular",
    fontSize: 12,
    color: "#9A968D",
    marginTop: 4,
  },
  dueSoon: {
    color: "#E85A1A",
  },
  sub: {
    fontFamily: "DMMono_Regular",
    fontSize: 12,
    color: "#B7B2A6",
    marginTop: 2,
  },
  chevronRow: {
    alignItems: "center",
    marginTop: 8,
  },
  chevron: {
    color: "#C9C2B2",
    fontSize: 12,
  },
  editArea: {
    marginTop: 14,
    gap: 10,
  },
  input: {
    backgroundColor: "#F5F2EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2C2C2C",
    fontFamily: "DMSans_Regular",
  },
  metaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F2EB",
    borderRadius: 10,
    padding: 10,
  },
  metaBtnText: {
    fontSize: 14,
    color: "#2C2C2C",
    fontFamily: "DMSans_Regular",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1D1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  label: {
    fontFamily: "DMMono_Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#9A968D",
  },
  textArea: {
    backgroundColor: "#F5F2EB",
    borderRadius: 10,
    padding: 12,
    height: 120,
    fontSize: 14,
    color: "#2C2C2C",
    fontFamily: "DMSans_Regular",
  },
  saveBtn: {
    backgroundColor: "#E85A1A",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    letterSpacing: 1.5,
    fontFamily: "DMMono_Medium",
  },
  deleteBtn: {
    backgroundColor: "#FBEAEA",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  deleteBtnText: {
    color: "#C0392B",
    fontSize: 13,
    letterSpacing: 1.5,
    fontFamily: "DMMono_Medium",
  },
});
