import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#eee" },
  headerInfo: { marginLeft: 15, justifyContent: "center" },
  name: { fontSize: 20, fontWeight: "bold" },
  location: { color: "#666", marginVertical: 4 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  rating: { fontWeight: "600", color: "#f1c40f" },
  reviews: { color: "#999", marginLeft: 5, fontSize: 12 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  bio: { lineHeight: 22, color: "#444" },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  serviceName: { fontSize: 16 },
  servicePrice: { fontWeight: "bold", color: "#2ecc71" },
  errorText: { color: "red" },
});
