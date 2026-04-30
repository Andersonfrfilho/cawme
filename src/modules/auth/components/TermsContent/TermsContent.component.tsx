import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { TermsContentProps } from "./types";

export const TermsContent: React.FC<TermsContentProps> = ({
  accepted,
  onToggleAccept,
  onSubmit,
  loading,
}) => {
  const { auth } = useLocale<LocaleKeys>();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.termsScroll}
        contentContainerStyle={styles.termsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.termsText}>{auth.termsContent}</Text>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={onToggleAccept}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
            {accepted && (
              <Ionicons
                name="checkmark"
                size={moderateScale(14, 0.3)}
                color={theme.palette.neutral[0]}
              />
            )}
          </View>
          <Text style={styles.checkboxText}>
            {auth.termsAcceptCheckbox}{" "}
            <Text style={styles.linkText}>{auth.termsLinkText}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!accepted || loading) && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={!accepted || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {auth.termsFinalizeButton}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
