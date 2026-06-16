import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
    paddingTop: theme.spacing[4],
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[8],
  },
  header: {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.primary.DEFAULT,
    borderBottomLeftRadius: theme.radii["3xl"],
    borderBottomRightRadius: theme.radii["3xl"],
    marginBottom: theme.spacing[6],
  },
  welcome: {
    fontSize: theme.typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },
  name: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    marginTop: theme.spacing[1],
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[8],
    gap: theme.spacing[4],
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[8],
  },
  section: {
    paddingHorizontal: theme.spacing[6],
    gap: theme.spacing[3],
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: theme.spacing[3],
  },
  sectionBadge: {
    backgroundColor: theme.colors.primary.DEFAULT + "15",
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(2),
    borderRadius: 10,
    marginLeft: theme.spacing[2],
  },
  sectionBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  emptyState: {
    padding: theme.spacing[10],
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[6],
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.status.error,
    textAlign: "center",
    marginTop: theme.spacing[10],
    paddingHorizontal: theme.spacing[6],
  },
});
