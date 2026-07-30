import { todayIso } from "@/lib/date";
import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useMemo, useState } from "react";
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
  const [email, setEmail] = useState<string | null>(null);

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

  // Angemeldeten Nutzer für Begrüßung/Avatar laden
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
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

  const today = todayIso();
  const dueTodayTasks = useMemo(
    () => tasks.filter((t) => t.due_date === today && !t.done),
    [tasks, today]
  );
  const otherTasks = useMemo(
    () => tasks.filter((t) => !dueTodayTasks.includes(t)),
    [tasks, dueTodayTasks]
  );
  const openCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);
  const projectCount = useMemo(
    () => new Set(tasks.map((t) => t.project_name).filter(Boolean)).size,
    [tasks]
  );

  const namePart = email?.split("@")[0] ?? "";
  const displayName = namePart
    ? namePart.charAt(0).toUpperCase() + namePart.slice(1)
    : "";
  const initials = namePart ? namePart.slice(0, 2).toUpperCase() : "··";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";

  const todayLabel = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateLabel}>{todayLabel}</Text>
            <Text style={styles.greeting}>
              {greeting}
              {displayName ? `, ${displayName}` : ""}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Überblick */}
        <Text style={styles.sectionLabel}>ÜBERBLICK</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.statNumberAccent]}>
              {projectCount}
            </Text>
            <Text style={styles.statLabel}>PROJEKTE</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{openCount}</Text>
            <Text style={styles.statLabel}>OFFEN</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dueTodayTasks.length}</Text>
            <Text style={styles.statLabel}>HEUTE FÄLLIG</Text>
          </View>
        </View>

        {/* Heute fällig */}
        {dueTodayTasks.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>HEUTE FÄLLIG</Text>
            {dueTodayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}

        {/* Alle Aufgaben */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>ALLE AUFGABEN</Text>
          <Pressable>
            <Text style={styles.sortLink}>SORTIEREN</Text>
          </Pressable>
        </View>

        {otherTasks.length > 0 ? (
          otherTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Keine weiteren Aufgaben.</Text>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={() => setVisible(true)} style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

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
                placeholderTextColor="#B9B4A9"
              />
              <TextInput
                style={styles.input}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Projektname"
                placeholderTextColor="#B9B4A9"
              />

              {/* META ROW */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => console.log("Person auswählen")}
                  style={styles.metaBtn}
                >
                  <View style={styles.metaAvatar}>
                    <Text style={styles.metaAvatarText}>ma</Text>
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
                <Text style={styles.saveBtnText}>SPEICHERN</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeButtonText}>Abbrechen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EB",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dateLabel: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#9A968D",
    marginBottom: 4,
  },
  greeting: {
    fontFamily: "DMSans_Bold",
    fontSize: 26,
    color: "#1D1D1B",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1D1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontFamily: "DMSans_Bold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0DAD0",
    marginTop: 20,
    marginBottom: 20,
  },

  sectionLabel: {
    fontFamily: "DMMono_Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#9A968D",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sortLink: {
    fontFamily: "DMMono_Medium",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#E85A1A",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  statNumber: {
    fontFamily: "DMSans_Bold",
    fontSize: 30,
    color: "#1D1D1B",
  },
  statNumberAccent: {
    color: "#E85A1A",
  },
  statLabel: {
    fontFamily: "DMMono_Regular",
    fontSize: 10,
    letterSpacing: 1,
    color: "#9A968D",
    marginTop: 4,
  },

  emptyText: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#9A968D",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E85A1A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "DMSans_Regular",
    lineHeight: 30,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(29,29,27,0.35)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    height: "70%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetTitle: {
    fontFamily: "DMSans_Bold",
    fontSize: 20,
    color: "#1D1D1B",
    marginBottom: 20,
  },
  editArea: {
    marginTop: 14,
    gap: 10,
  },
  input: {
    backgroundColor: "#F5F2EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    borderRadius: 12,
    padding: 12,
  },
  metaBtnText: {
    fontSize: 14,
    color: "#2C2C2C",
    fontFamily: "DMSans_Regular",
  },
  metaAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1D1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  metaAvatarText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#E85A1A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    letterSpacing: 1.5,
    fontFamily: "DMMono_Medium",
  },
  closeButton: {
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    color: "#9A968D",
    fontFamily: "DMSans_Regular",
    fontSize: 14,
  },
});
