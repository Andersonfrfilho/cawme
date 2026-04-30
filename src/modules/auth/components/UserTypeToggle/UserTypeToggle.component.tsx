import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { useEffect, useCallback, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import type { UserTypeToggleProps, UserType } from "./types";

export const UserTypeToggle: React.FC<UserTypeToggleProps> = ({
  selected,
  onSelect,
}) => {
  const { auth } = useLocale<LocaleKeys>();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
    const half = w / 2;
    translateX.value = selected === "contractor" ? 0 : half - moderateScale(8, 0.5) * 2;
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      const half = containerWidth / 2;
      translateX.value = withSpring(
        selected === "contractor" ? 0 : half - moderateScale(8, 0.5) * 2,
        { damping: 20, stiffness: 200 },
      );
    }
  }, [selected, containerWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const options: { type: UserType; label: string }[] = [
    { type: "contractor", label: auth.registerToggleClient },
    { type: "provider", label: auth.registerToggleProvider },
  ];

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Animated.View style={[styles.pill, pillStyle]} />
      {options.map((option) => (
        <TouchableOpacity
          key={option.type}
          style={styles.option}
          onPress={() => onSelect(option.type)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              selected === option.type && styles.optionTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
