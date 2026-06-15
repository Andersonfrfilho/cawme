import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import type { ConfirmModalProps } from "./types";

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.8}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  box: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 16,
    padding: moderateScale(24, 0.5),
    width: "100%",
    gap: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(20, 0.3),
  },
  actions: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  cancelButton: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  confirmButton: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: 10,
    backgroundColor: theme.colors.status.error,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
});
