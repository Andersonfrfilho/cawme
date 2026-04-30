import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { RegisterSuccessProps } from "./types";

export const RegisterSuccess: React.FC<RegisterSuccessProps> = ({
  email,
  onGoToLogin,
}) => {
  const { auth } = useLocale<LocaleKeys>();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.iconContainer}>
        <Ionicons
          name="mail-outline"
          size={scale(64)}
          color={theme.colors.primary.DEFAULT}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600)}>
        <Text style={styles.title}>{auth.successTitle}</Text>
        <Text style={styles.description}>{auth.successDescription}</Text>
        {email && (
          <Text style={styles.email}>{email}</Text>
        )}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onGoToLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>{auth.successGoToLogin}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
