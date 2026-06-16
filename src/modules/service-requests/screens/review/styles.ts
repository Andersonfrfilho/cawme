import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background.DEFAULT },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
  },
  backButton: { padding: moderateScale(4, 0.5) },
  headerTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: "700",
    color: theme.palette.neutral[0],
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(24, 0.5),
  },
  serviceCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  serviceLabel: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: "700",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: verticalScale(4),
  },
  serviceName: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  sectionTitle: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: verticalScale(16),
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(8, 0.5),
    marginBottom: verticalScale(28),
  },
  starButton: { padding: moderateScale(4, 0.5) },
  commentLabel: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: 10,
    padding: moderateScale(12, 0.5),
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.card,
    minHeight: verticalScale(100),
    textAlignVertical: "top",
    marginBottom: verticalScale(32),
  },
  submitButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 10,
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: "700",
  },
  starIcon: { width: scale(40), height: scale(40) },
});

export default styles;
