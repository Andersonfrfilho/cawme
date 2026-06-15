import React from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";
import type { ToastState } from "@/shared/hooks/useToast";

type ToastProps = {
  toast: ToastState | null;
  opacity: Animated.Value;
};

export const Toast: React.FC<ToastProps> = ({ toast, opacity }) => {
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        toast.type === "success" ? styles.toastSuccess : styles.toastError,
        { opacity, bottom: insets.bottom + verticalScale(24) },
      ]}
      pointerEvents="none"
    >
      <Ionicons
        name={toast.type === "success" ? "checkmark-circle" : "alert-circle"}
        size={moderateScale(18, 0.3)}
        color={theme.palette.neutral[0]}
      />
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: moderateScale(24, 0.5),
    right: moderateScale(24, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(12),
    borderRadius: theme.radii.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  toastSuccess: {
    backgroundColor: theme.colors.accent.green,
  },
  toastError: {
    backgroundColor: theme.colors.status.error,
  },
  toastText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.palette.neutral[0],
  },
});
