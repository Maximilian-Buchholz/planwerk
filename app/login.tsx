import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Falsche Email oder Passwort");
    } else {
      router.replace("../");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={styles.logoBlack}>PLAN</Text>
        <Text style={styles.logoOrange}>WERK</Text>
      </View>

      <Text style={styles.heading}>Willkommen zurück.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>E-MAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          placeholderTextColor="#B9B4A9"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>PASSWORT</Text>
        <TextInput
          style={styles.input}
          placeholder="***********"
          placeholderTextColor="#B9B4A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.optionsRow}>
        <Pressable
          style={styles.rememberRow}
          onPress={() => setRememberMe((prev) => !prev)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Angemeldet bleiben</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Vergessen?</Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryBtnText}>ANMELDEN</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ODER</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>Mit SSO anmelden</Text>
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Neu hier? </Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.link}>Konto erstellen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EB",
    paddingHorizontal: 24,
    paddingTop: 90,
  },

  logoRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 64,
  },
  logoBlack: {
    fontFamily: "DMMono_Medium",
    fontSize: 30,
    letterSpacing: 4,
    color: "#1D1D1B",
  },
  logoOrange: {
    fontFamily: "DMMono_Medium",
    fontSize: 30,
    letterSpacing: 4,
    color: "#E85A1A",
  },

  heading: {
    fontFamily: "DMSans_Regular",
    fontSize: 30,
    color: "#3B3B3B",
    marginBottom: 32,
  },

  field: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "DMMono_Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#9A968D",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2C2C2C",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#D8D2C6",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#E85A1A",
    borderColor: "#E85A1A",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  rememberText: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#5B5B5B",
  },
  link: {
    fontFamily: "DMSans_Bold",
    fontSize: 14,
    color: "#E85A1A",
  },

  primaryBtn: {
    backgroundColor: "#E85A1A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  primaryBtnText: {
    fontFamily: "DMMono_Medium",
    fontSize: 14,
    letterSpacing: 2,
    color: "#FFFFFF",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0DAD0",
  },
  dividerText: {
    fontFamily: "DMMono_Regular",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#B7B2A6",
  },

  secondaryBtn: {
    backgroundColor: "rgba(224, 218, 208, 0.44)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  secondaryBtnText: {
    fontFamily: "DMMono_Regular",
    fontSize: 14,
    letterSpacing: 2,
    color: "#9A968D",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#5B5B5B",
  },
});
