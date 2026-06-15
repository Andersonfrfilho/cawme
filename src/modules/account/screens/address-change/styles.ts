import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
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
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
  },
  searchSection: {
    marginBottom: moderateScale(20, 0.5),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(12, 0.5),
    backgroundColor: theme.colors.background.elevated,
    gap: moderateScale(8, 0.5),
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
  },
  suggestionsList: {
    marginTop: moderateScale(4, 0.5),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.card,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    gap: moderateScale(10, 0.5),
  },
  suggestionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  suggestionIcon: {
    flexShrink: 0,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionStreet: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  suggestionCity: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: moderateScale(2, 0.5),
  },
  fieldGroup: {
    gap: moderateScale(6, 0.5),
    marginBottom: moderateScale(20, 0.5),
  },
  label: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  row: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  fieldFlex: {
    flex: 1,
  },
  fieldFlexLarge: {
    flex: 2,
  },
  fieldSmall: {
    flex: 1,
    gap: moderateScale(6, 0.5),
    marginBottom: moderateScale(20, 0.5),
  },
  inputFlex: {
    flex: 1,
  },
  cepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cepSpinner: {
    marginLeft: moderateScale(8, 0.5),
  },
  primaryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(14, 0.5),
    marginBottom: moderateScale(20, 0.5),
    gap: moderateScale(12, 0.5),
  },
  primaryRowText: {
    flex: 1,
    gap: moderateScale(2, 0.5),
  },
  primaryRowTitle: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  primaryRowSubtitle: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  mapSection: {
    gap: moderateScale(8, 0.5),
    marginBottom: moderateScale(20, 0.5),
  },
  mapContainer: {
    height: verticalScale(200),
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
  },
  map: {
    flex: 1,
  },
  mapPinOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: moderateScale(20, 0.3),
  },
  mapHint: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.tertiary,
    textAlign: "center",
  },
  saveButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(8),
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
