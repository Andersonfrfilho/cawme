import React, { useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { DocumentUploadSheetProps } from "./types";

export const DocumentUploadSheet: React.FC<DocumentUploadSheetProps> = ({
  visible,
  onNow,
  onLater,
  isProvider = false,
}) => {
  const { auth } = useLocale<LocaleKeys>();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.handle} />

          <View style={styles.iconContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={moderateScale(32, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </View>

          <Text style={styles.title}>{auth.documentSheetTitle}</Text>
          <Text style={styles.subtitle}>
            {isProvider ? auth.documentSheetProviderMandatory : auth.documentSheetSubtitle}
          </Text>

          <TouchableOpacity
            testID="document-sheet-now-button"
            style={styles.optionNow}
            onPress={onNow}
            activeOpacity={0.85}
          >
            <View style={styles.optionIconNow}>
              <Ionicons
                name="camera-outline"
                size={moderateScale(20, 0.3)}
                color={theme.palette.neutral[0]}
              />
            </View>
            <View style={styles.optionTextGroup}>
              <Text style={styles.optionTitleNow}>{auth.documentSheetNow}</Text>
              <Text style={styles.optionDescriptionNow}>{auth.documentSheetNowDescription}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(18, 0.3)}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>

          {!isProvider && (
            <TouchableOpacity
              testID="document-sheet-later-button"
              style={styles.optionLater}
              onPress={onLater}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconLater}>
                <Ionicons
                  name="time-outline"
                  size={moderateScale(20, 0.3)}
                  color={theme.colors.primary.DEFAULT}
                />
              </View>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitleLater}>{auth.documentSheetLater}</Text>
                <Text style={styles.optionDescriptionLater}>{auth.documentSheetLaterDescription}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(18, 0.3)}
                color={theme.palette.neutral[300]}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
