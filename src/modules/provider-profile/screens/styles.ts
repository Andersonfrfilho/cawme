import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing[6],
  },
  header: {
    padding: theme.spacing[6],
    backgroundColor: theme.palette.neutral[0],
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.radii.xl,
    backgroundColor: theme.palette.neutral[200],
  },
  headerInfo: {
    flex: 1,
    marginLeft: theme.spacing[4],
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  ratingContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing[1],
  },
  starsRow: {
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  ratingTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[2],
  },
  reviews: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  section: {
    padding: theme.spacing[6],
    backgroundColor: theme.palette.neutral[0],
    marginTop: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  bio: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  serviceName: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  servicePrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  paymentMethodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
  },
  paymentMethodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[1],
    backgroundColor: theme.colors.primary.surface,
    borderRadius: 20,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT,
  },
  paymentMethodLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.status.error,
    textAlign: "center",
  },
  reviewItem: {
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[1],
  },
  reviewStars: {
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  reviewMeta: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  reviewComment: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  reviewAuthor: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontStyle: "italic",
  },
  notApprovedBanner: {
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[2],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.accent.yellowLight,
    borderRadius: 8,
    alignItems: "center",
  },
  notApprovedText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
