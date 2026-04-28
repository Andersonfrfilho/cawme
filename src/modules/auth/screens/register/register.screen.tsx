import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { t } from "@/shared/locales";
import { styles } from "./styles";

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("auth.registerTitle")}</Text>
        <Text style={styles.subtitle}>{t("auth.registerSubtitle")}</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{t("auth.backToLogin")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
