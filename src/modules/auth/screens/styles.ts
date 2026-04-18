import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 50 },
  title: { fontSize: 32, fontWeight: "bold", color: "#007AFF", marginTop: 10 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 5 },
  form: { width: "100%" },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    height: 56,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
