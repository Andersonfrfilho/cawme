import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking, ActivityIndicator, Modal, TextInput } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { useAuth } from "../../hooks/useAuth";
import { KeycloakService } from "../../services/keycloak.service";
import { useAuthStore } from "../../store/auth.store";
import { logger } from "@/shared/utils/logger";
import { styles } from "./styles";
import type {
  BlockAction,
  BlockReason,
  AccountBlockStatus,
  BlockedAccountScreenParams,
} from "./types";

const REASON_CONFIG: Record<string, { icon: string; color: string }> = {
  EMAIL_CONFLICT: { icon: "mail-outline", color: theme.colors.status.error },
  PHONE_CONFLICT: { icon: "call-outline", color: theme.colors.status.error },
  DOCUMENT_CONFLICT: { icon: "card-outline", color: theme.colors.status.error },
  FRAUD_SUSPICION: { icon: "shield-half-outline", color: theme.colors.status.error },
  TERMS_VIOLATION: { icon: "document-text-outline", color: theme.colors.status.warning },
  MANUAL_BLOCK: { icon: "hand-left-outline", color: theme.colors.status.error },
  VERIFICATION_FAILED: { icon: "refresh-circle-outline", color: theme.colors.status.warning },
  ACCOUNT_DISABLED: { icon: "person-remove-outline", color: theme.colors.status.error },
};

export default function BlockedAccountScreen() {
  const { auth } = useLocale<LocaleKeys>();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<BlockedAccountScreenParams>();
  const { initiateSelfUnlock, verifySelfUnlock } = useAuth();

  const [blockStatus, setBlockStatus] = useState<AccountBlockStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const [selfUnlockState, setSelfUnlockState] = useState<{
    visible: boolean;
    blockId: string | null;
    destination: string | null;
    code: string[];
    error: string | null;
    isVerifying: boolean;
  }>({
    visible: false,
    blockId: null,
    destination: null,
    code: ['', '', '', ''],
    error: null,
    isVerifying: false,
  });

  useEffect(() => {
    async function loadBlockStatus() {
      try {
        const status = await KeycloakService.getAccountBlockStatus();
        setBlockStatus(status as AccountBlockStatus);
      } catch {
        // Fallback: usa os params ou gera um genérico
        setBlockStatus({
          blocked: true,
          reason: params.reason || "UNKNOWN",
          message: params.message || auth.blockedAccountDescription,
          title: params.title || auth.blockedAccountTitle,
          severity: "error",
          actions: [
            { type: "contact_support", label: auth.blockedAccountSupportButton, variant: "primary" },
            { type: "go_to_login", label: auth.blockedAccountLoginButton, variant: "outline" },
          ],
        } as AccountBlockStatus);
      } finally {
        setIsLoading(false);
      }
    }

    loadBlockStatus();
  }, [auth.blockedAccountDescription, auth.blockedAccountTitle, auth.blockedAccountSupportButton, auth.blockedAccountLoginButton, params]);

  const handleAction = async (action: BlockAction) => {
    logger.screenEvent("BlockedAccountScreen", "action", { type: action.type });

    switch (action.type) {
      case "contact_support":
        if (action.url) {
          Linking.openURL(action.url);
        } else {
          // Fallback: WhatsApp
          const phone = "+5511999999999";
          const text = `Olá, minha conta foi bloqueada. Motivo: ${blockStatus?.reason}`;
          Linking.openURL(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`);
        }
        break;

      case "retry":
        if (action.blockId) {
          try {
            const result = await initiateSelfUnlock({ blockId: action.blockId });
            setSelfUnlockState({
              visible: true,
              blockId: action.blockId,
              destination: result.destination,
              code: ['', '', '', ''],
              error: null,
              isVerifying: false,
            });
          } catch (error) {
            setSelfUnlockState((prev) => ({
              ...prev,
              error: auth.selfUnlockError || 'Erro ao iniciar desbloqueio',
            }));
          }
        } else if (action.route) {
          router.replace(action.route as any);
        } else {
          router.back();
        }
        break;

      case "logout":
        await logout();
        router.replace("/(auth)");
        break;

      case "go_to_login":
        router.replace("/login" as any);
        break;

      case "dismiss":
        router.replace("/(app)/home" as any);
        break;
    }
  };

  const handleSelfUnlockVerify = async () => {
    if (!selfUnlockState.blockId) return;

    const code = selfUnlockState.code.join('');
    if (code.length !== 4) {
      setSelfUnlockState((prev) => ({
        ...prev,
        error: auth.selfUnlockInvalidCode || 'Código deve ter 4 dígitos',
      }));
      return;
    }

    setSelfUnlockState((prev) => ({ ...prev, isVerifying: true, error: null }));

    try {
      const result = await verifySelfUnlock({
        blockId: selfUnlockState.blockId,
        code,
      });

      if (result.blockResolved) {
        setSelfUnlockState((prev) => ({ ...prev, visible: false }));
        router.replace("/(auth)");
      } else {
        setSelfUnlockState((prev) => ({
          ...prev,
          error: result.message || auth.selfUnlockInvalidCode,
          code: ['', '', '', ''],
        }));
      }
    } catch (error) {
      setSelfUnlockState((prev) => ({
        ...prev,
        error: auth.selfUnlockError || 'Erro ao verificar código',
      }));
    } finally {
      setSelfUnlockState((prev) => ({ ...prev, isVerifying: false }));
    }
  };

  const getReasonConfig = (reason: string | null) => {
    if (!reason) return { icon: "alert-circle-outline", color: theme.colors.status.error };
    return REASON_CONFIG[reason] || { icon: "alert-circle-outline", color: theme.colors.status.error };
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={["bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!blockStatus) return null;

  const config = getReasonConfig(blockStatus.reason);
  const title = blockStatus.title || auth.blockedAccountTitle;

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={["bottom"]}>
      <View style={styles.container}>
        {/* Ícone dinâmico */}
        <View style={[styles.iconContainer, { backgroundColor: config.color + "15" }]}>
          <Ionicons name={config.icon as any} size={moderateScale(72, 0.3)} color={config.color} />
        </View>

        {/* Título */}
        <Text style={styles.title}>{title}</Text>

        {/* Motivo/Mensagem */}
        <View style={styles.messageCard}>
          <View style={styles.reasonBadge}>
            <Text style={styles.reasonBadgeText}>{blockStatus.reason}</Text>
          </View>
          <Text style={styles.messageText}>{blockStatus.message}</Text>
          {blockStatus.canRetryAt && (
            <Text style={styles.retryText}>
              Você poderá tentar novamente em: {new Date(blockStatus.canRetryAt).toLocaleString()}
            </Text>
          )}
        </View>

        {/* Ações dinâmicas do BFF */}
        <View style={styles.actionsContainer}>
          {blockStatus.actions.map((action, index) => (
            <TouchableOpacity
              key={`${action.type}-${index}`}
              style={[
                styles.actionButton,
                action.variant === "primary" && styles.actionButtonPrimary,
                action.variant === "outline" && styles.actionButtonOutline,
                action.variant === "secondary" && styles.actionButtonSecondary,
              ]}
              onPress={() => handleAction(action)}
              activeOpacity={0.85}
            >
              {action.type === "contact_support" && (
                <Ionicons name="chatbubbles-outline" size={moderateScale(20, 0.3)} color={action.variant === "primary" ? theme.palette.neutral[0] : theme.colors.primary.DEFAULT} style={styles.actionIcon} />
              )}
              {action.type === "retry" && (
                <Ionicons name="refresh-outline" size={moderateScale(20, 0.3)} color={action.variant === "primary" ? theme.palette.neutral[0] : theme.colors.primary.DEFAULT} style={styles.actionIcon} />
              )}
              {action.type === "logout" && (
                <Ionicons name="log-out-outline" size={moderateScale(20, 0.3)} color={action.variant === "primary" ? theme.palette.neutral[0] : theme.colors.status.error} style={styles.actionIcon} />
              )}
              {action.type === "go_to_login" && (
                <Ionicons name="arrow-back-outline" size={moderateScale(20, 0.3)} color={action.variant === "primary" ? theme.palette.neutral[0] : theme.colors.text.secondary} style={styles.actionIcon} />
              )}
              <Text
                style={[
                  styles.actionButtonText,
                  action.variant === "primary" && styles.actionButtonTextPrimary,
                  action.variant === "outline" && styles.actionButtonTextOutline,
                  action.variant === "secondary" && styles.actionButtonTextSecondary,
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Self-unlock modal */}
      <Modal
        visible={selfUnlockState.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() =>
          setSelfUnlockState((prev) => ({ ...prev, visible: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() =>
                  setSelfUnlockState((prev) => ({ ...prev, visible: false }))
                }
              >
                <Ionicons
                  name="close-outline"
                  size={moderateScale(24, 0.3)}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{auth.selfUnlockTitle}</Text>
            <Text style={styles.modalSubtitle}>
              {auth.selfUnlockCodeLabel} {selfUnlockState.destination}
            </Text>

            {/* Code inputs */}
            <View style={styles.codeInputsContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  testID={`self-unlock-code-input-${index}`}
                  style={styles.codeInput}
                  placeholder="0"
                  placeholderTextColor={theme.palette.neutral[400]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={selfUnlockState.code[index]}
                  onChangeText={(text) => {
                    const newCode = [...selfUnlockState.code];
                    newCode[index] = text.replace(/[^0-9]/g, '');
                    setSelfUnlockState((prev) => ({ ...prev, code: newCode, error: null }));
                  }}
                  editable={!selfUnlockState.isVerifying}
                />
              ))}
            </View>

            {/* Error message */}
            {selfUnlockState.error && (
              <Text testID="self-unlock-error-message" style={styles.errorText}>
                {selfUnlockState.error}
              </Text>
            )}

            {/* Buttons */}
            <TouchableOpacity
              testID="self-unlock-verify-button"
              style={[
                styles.modalButton,
                (selfUnlockState.code.join('').length !== 4 ||
                  selfUnlockState.isVerifying) &&
                  styles.modalButtonDisabled,
              ]}
              onPress={handleSelfUnlockVerify}
              disabled={
                selfUnlockState.code.join('').length !== 4 ||
                selfUnlockState.isVerifying
              }
            >
              {selfUnlockState.isVerifying ? (
                <ActivityIndicator color={theme.palette.neutral[0]} size="small" />
              ) : (
                <Text style={styles.modalButtonText}>
                  {auth.selfUnlockVerifyButton}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
