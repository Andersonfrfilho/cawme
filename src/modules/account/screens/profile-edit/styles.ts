import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: moderateScale(12, 0.5),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(32),
    paddingBottom: moderateScale(32, 0.5),
    gap: moderateScale(24, 0.5),
  },
  fieldGroup: {
    gap: moderateScale(8, 0.5),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.border.DEFAULT,
  },
  label: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
    paddingVertical: moderateScale(2, 0.5),
    paddingHorizontal: moderateScale(8, 0.5),
    borderRadius: 8,
    backgroundColor: theme.colors.background.elevated,
  },
  showAllText: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  input: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
  },
  inputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  contactRow: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(14, 0.5),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    gap: moderateScale(8, 0.5),
  },
  contactFlag: {
    fontSize: moderateScale(16, 0.3),
  },
  contactValue: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    flex: 1,
  },
  contactSubValue: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: moderateScale(2, 0.5),
  },
  contactValueWrapper: {
    flex: 1,
  },
  contactAddressCount: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
    marginTop: moderateScale(3, 0.5),
  },
  contactRowTall: {
    height: undefined,
    minHeight: verticalScale(52),
    paddingVertical: moderateScale(12, 0.5),
  },
  eyeButton: {
    padding: moderateScale(4, 0.5),
  },
  chevronButton: {
    padding: moderateScale(4, 0.5),
  },
  contactChangeLabel: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
    backgroundColor: theme.colors.accent.yellow,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: moderateScale(4, 0.5),
  },
  pendingBadgeText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
  saveButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
});

export default styles;
