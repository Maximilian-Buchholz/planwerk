import { formatRelativeDay, todayIso } from "@/lib/date";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type InboxMessage = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  avatarInitials: string;
  avatarColor: string;
  suggestTask?: boolean;
};

const yesterdayIso = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
})();

// TODO: durch echte Nachrichten aus dem Backend ersetzen, sobald ein
// Postfach-Datenmodell existiert.
const MOCK_MESSAGES: InboxMessage[] = [
  {
    id: "1",
    sender: "Bernd Fischer",
    subject: "Rücksprache",
    preview:
      "Hallo Max, wann bist du heute im Büro? Ich wollte mit dir noch einmal die…",
    date: todayIso(),
    unread: true,
    avatarInitials: "BF",
    avatarColor: "#3F7D53",
  },
  {
    id: "2",
    sender: "Maik Kovak",
    subject: "Marketing Kampagne",
    preview:
      "Hey Max, könntest du bitte die Präsentation für unseren Kundentermin bis Freitag fertigstellen?",
    date: yesterdayIso,
    unread: false,
    avatarInitials: "MK",
    avatarColor: "#5B3E96",
    suggestTask: true,
  },
  {
    id: "3",
    sender: "Darcell M'Avis",
    subject: "Internet",
    preview: "Wäre der neue 1&1 Internetvertrag eine Option für die Firma?",
    date: "2026-04-10",
    unread: false,
    avatarInitials: "DM",
    avatarColor: "#1F2A5C",
  },
];

type Filter = "all" | "unread";

export default function Inbox() {
  const [filter, setFilter] = useState<Filter>("all");
  const [initials, setInitials] = useState("··");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const namePart = data.user?.email?.split("@")[0] ?? "";
      if (namePart) setInitials(namePart.slice(0, 2).toUpperCase());
    });
  }, []);

  const today = todayIso();
  const totalCount = MOCK_MESSAGES.length;
  const unreadCount = MOCK_MESSAGES.filter((m) => m.unread).length;

  const visibleMessages = MOCK_MESSAGES.filter(
    (m) => filter === "all" || m.unread
  );
  const todayMessages = visibleMessages.filter((m) => m.date === today);
  const earlierMessages = visibleMessages.filter((m) => m.date !== today);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.canGoBack() && router.back()}
          hitSlop={10}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Postfach</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("all")}
          style={[styles.filterPill, filter === "all" && styles.filterPillActive]}
        >
          <Text
            style={[styles.filterText, filter === "all" && styles.filterTextActive]}
          >
            Alle
          </Text>
          <View
            style={[
              styles.filterBadge,
              filter === "all" && styles.filterBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.filterBadgeText,
                filter === "all" && styles.filterBadgeTextActive,
              ]}
            >
              {totalCount}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setFilter("unread")}
          style={[
            styles.filterPill,
            filter === "unread" && styles.filterPillActive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === "unread" && styles.filterTextActive,
            ]}
          >
            Ungelesen
          </Text>
          <View
            style={[
              styles.filterBadge,
              filter === "unread" && styles.filterBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.filterBadgeText,
                filter === "unread" && styles.filterBadgeTextActive,
              ]}
            >
              {unreadCount}
            </Text>
          </View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {todayMessages.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>HEUTE</Text>
            {todayMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </>
        )}

        {earlierMessages.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>FRÜHER</Text>
            {earlierMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </>
        )}

        {visibleMessages.length === 0 && (
          <Text style={styles.emptyText}>Keine Nachrichten.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function MessageCard({ message }: { message: InboxMessage }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View
          style={[styles.messageAvatar, { backgroundColor: message.avatarColor }]}
        >
          <Text style={styles.messageAvatarText}>{message.avatarInitials}</Text>
        </View>
        <View style={styles.cardTextBlock}>
          <View style={styles.cardTopRow}>
            <Text style={styles.sender}>{message.sender}</Text>
            <View style={styles.timestampRow}>
              {message.unread && <View style={styles.unreadDot} />}
              <Text style={styles.timestamp}>
                {formatRelativeDay(message.date)}
              </Text>
            </View>
          </View>
          <Text style={styles.subject}>{message.subject}</Text>
          <Text style={styles.preview} numberOfLines={2}>
            {message.preview}
          </Text>
        </View>
      </View>

      {message.suggestTask && (
        <>
          <View style={styles.cardDivider} />
          <View style={styles.cardActionsRow}>
            <Pressable style={styles.suggestBtn}>
              <Text style={styles.suggestBtnText}>Task vorschlagen</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.createTaskLink}>Task erstellen ›</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EB",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 30,
    color: "#1D1D1B",
    width: 44,
  },
  title: {
    fontFamily: "DMSans_Bold",
    fontSize: 24,
    color: "#1D1D1B",
    flex: 1,
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
    marginTop: 16,
    marginBottom: 16,
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: "#E85A1A",
  },
  filterText: {
    fontFamily: "DMSans_Medium",
    fontSize: 14,
    color: "#5B5B5B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  filterBadge: {
    backgroundColor: "#F0ECE3",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  filterBadgeText: {
    fontFamily: "DMMono_Medium",
    fontSize: 12,
    color: "#5B5B5B",
  },
  filterBadgeTextActive: {
    color: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: "DMMono_Regular",
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#9A968D",
    marginBottom: 12,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#9A968D",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  messageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  messageAvatarText: {
    color: "#fff",
    fontFamily: "DMSans_Bold",
    fontSize: 13,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sender: {
    fontFamily: "DMSans_Bold",
    fontSize: 16,
    color: "#1D1D1B",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E85A1A",
  },
  timestamp: {
    fontFamily: "DMMono_Regular",
    fontSize: 12,
    color: "#E85A1A",
  },
  subject: {
    fontFamily: "DMSans_Regular",
    fontSize: 13,
    color: "#9A968D",
    marginTop: 2,
  },
  preview: {
    fontFamily: "DMSans_Regular",
    fontSize: 14,
    color: "#5B5B5B",
    marginTop: 6,
    lineHeight: 19,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#E0DAD0",
    marginVertical: 12,
  },
  cardActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestBtn: {
    backgroundColor: "rgba(232, 90, 26, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  suggestBtnText: {
    fontFamily: "DMSans_Medium",
    fontSize: 12,
    color: "#E85A1A",
  },
  createTaskLink: {
    fontFamily: "DMSans_Bold",
    fontSize: 13,
    color: "#E85A1A",
  },
});
