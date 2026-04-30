import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { WelcomeActionsProps } from "./types";

export const WelcomeActions: React.FC<WelcomeActionsProps> = ({
  onHireService,
  onOfferService,
  onAlreadyHaveAccount,
}) => {
  const { auth } = useLocale<LocaleKeys>();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onHireService}
          activeOpacity={0.85}
        >
          <Ionicons
            name="search-outline"
            size={moderateScale(20, 0.3)}
            color={theme.palette.neutral[0]}
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>
            {auth.welcomeHireService}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={onOfferService}
          activeOpacity={0.85}
        >
          <Ionicons
            name="briefcase-outline"
            size={moderateScale(20, 0.3)}
            color={theme.colors.primary.DEFAULT}
            style={styles.buttonIcon}
          />
          <Text style={styles.outlineButtonText}>
            {auth.welcomeOfferService}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            {auth.welcomeAlreadyHaveAccount}{" "}
          </Text>
          <TouchableOpacity onPress={onAlreadyHaveAccount} activeOpacity={0.7}>
            <Text style={styles.loginLink}>{auth.welcomeLoginLink}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
