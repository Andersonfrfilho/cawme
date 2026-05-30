import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useAccount } from "@/modules/account/hooks/useAccount";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale } from "@/shared/utils/scale";

import styles from "./styles";
import { profileEditSchema, type ProfileEditFormValues } from "./types";

export default function ProfileEditScreen() {
  const { account } = useLocale<LocaleKeys>();
  const user = useAuthStore((state) => state.user);
  const { updateName } = useAccount();

  const [nameFocused, setNameFocused] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: { fullName: user?.name ?? "" },
  });

  const fullName = watch("fullName");

  async function onSubmit(values: ProfileEditFormValues): Promise<void> {
    try {
      await updateName({ fullName: values.fullName });
      Alert.alert("", account.saveSuccess);
    } catch {
      Alert.alert("", "Não foi possível atualizar o perfil. Tente novamente.");
    }
  }

  function handleEmailChange(): void {
    router.push({
      pathname: "/(app)/account/contact-change" as any,
      params: { type: "email", currentContact: user?.email ?? "" },
    });
  }

  function handlePhoneChange(): void {
    router.push({
      pathname: "/(app)/account/contact-change" as any,
      params: { type: "phone", currentContact: user?.phone ?? "" },
    });
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{account.editTitle}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: moderateScale(32, 0.5) }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.nameLabel}</Text>
          <TextInput
            style={[styles.input, nameFocused && styles.inputFocused]}
            placeholder={account.namePlaceholder}
            placeholderTextColor={theme.colors.text.secondary}
            value={fullName}
            onChangeText={(text) => setValue("fullName", text, { shouldValidate: true })}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoCorrect={false}
            testID="full-name-input"
          />
          {errors.fullName && (
            <Text style={{ fontSize: moderateScale(12, 0.3), color: theme.colors.status.error }}>
              {errors.fullName.message}
            </Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.emailLabel}</Text>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={handleEmailChange}
            testID="change-email-button"
            activeOpacity={0.7}
          >
            <Text style={styles.contactValue} numberOfLines={1}>
              {user?.email ?? "—"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{account.phoneLabel}</Text>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={handlePhoneChange}
            testID="change-phone-button"
            activeOpacity={0.7}
          >
            <Text style={styles.contactValue} numberOfLines={1}>
              {user?.phone ?? "—"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(16, 0.3)}
              color={theme.colors.primary.DEFAULT}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          testID="save-button"
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? account.savingButton : account.saveButton}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
