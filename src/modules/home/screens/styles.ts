import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { color: "red", marginBottom: 10 },
  retryText: { color: "#007AFF" },
  container: { flex: 1, backgroundColor: "#fff" },
});
