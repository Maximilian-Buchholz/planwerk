import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TaskCard() {
  const [done, setDone] = useState(false);

  return (
    <View style={styles.row}>
      <View style={styles.leftSection}>
        <Pressable onPress={() => setDone(!done)} style={styles.radioWrapper}>
          <View style={[styles.radio, done && styles.radioDone]} />
        </Pressable>

        <View style={styles.textBlock}>
          <Text style={[styles.title, done && styles.titleDone]}>
            Projekt A
          </Text>
          <Text style={styles.sub}>Projektname</Text>
        </View>
      </View>
      <View style={styles.dateBox}>
        <Text style={styles.date}>15 Jun</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",

    padding: 30,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardDone: {
    opacity: 0.6,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
  },

  radioDone: {
    backgroundColor: "#4F8EF7",
    borderColor: "#4F8EF7",
  },

  title: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMMono_Regular",
  },

  titleDone: {
    textDecorationLine: "line-through",
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
    alignItems: "flex-start",
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
});
