import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/shared/constants";
import { styles } from "./styles";
import type { LoginHeroProps } from "./types";

export const LoginHero: React.FC<LoginHeroProps> = ({
  title,
  subtitle,
  showBackground = true,
  showContent = true,
}) => {
  return (
    <View style={styles.hero}>
      {showBackground && (
        <>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />
        </>
      )}

      {showContent && (
        <Animated.View
          entering={FadeIn.delay(0).duration(700)}
          style={styles.heroContent}
        >
          <View style={styles.logoMark}>
            <Ionicons
              name="home"
              size={28}
              color={theme.colors.primary.DEFAULT}
            />
          </View>
          <Text style={styles.appName}>Cawme</Text>
          {subtitle && <Text style={styles.tagline}>{subtitle}</Text>}
        </Animated.View>
      )}
    </View>
  );
};
