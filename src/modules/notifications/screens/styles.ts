import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { marginTop: 20 },
  notificationCard: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  readCard: { opacity: 0.6 },
  iconContainer: { width: 48, alignItems: "center" },
  content: { flex: 1 },
  title: { fontWeight: "600" },
  body: { color: "#666" },
  time: { color: "#999", fontSize: 12, marginTop: 6 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff3b30",
  },
  empty: { padding: 20, alignItems: "center" },
  emptyText: { color: "#666" },
  readText: { color: "#999" },
});
