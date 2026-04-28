import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  loader: {
    marginTop: theme.spacing[8],
  },
  roomItem: {
    flexDirection: "row",
    padding: theme.spacing[4],
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.palette.neutral[200],
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing[3.5],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[1],
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  time: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  lastMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  badge: {
    backgroundColor: theme.colors.status.error,
    minWidth: 20,
    height: 20,
    borderRadius: theme.radii.full,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing[1.5],
    marginLeft: theme.spacing[2],
  },
  badgeText: {
    color: theme.palette.neutral[0],
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: theme.spacing[1.5],
    paddingHorizontal: theme.spacing[4],
  },
  myRow: {
    justifyContent: "flex-end",
  },
  otherRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: theme.spacing[3],
    borderRadius: theme.radii.lg,
  },
  myBubble: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderBottomRightRadius: theme.radii.none,
  },
  otherBubble: {
    backgroundColor: theme.palette.neutral[100],
    borderBottomLeftRadius: theme.radii.none,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: 22,
  },
  myText: {
    color: theme.palette.neutral[0],
  },
  otherText: {
    color: theme.colors.text.primary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: theme.spacing[1],
    alignSelf: "flex-end",
  },
  myTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherTime: {
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    padding: theme.spacing[3],
    backgroundColor: theme.palette.neutral[0],
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
  },
  input: {
    flex: 1,
    backgroundColor: theme.palette.neutral[100],
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2.5],
    marginRight: theme.spacing[2],
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
});
