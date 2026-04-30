import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { styles } from "./styles";

type AnimatedDotProps = {
  isActive: boolean;
  activeIndex: number;
  index: number;
};

export const AnimatedDot: React.FC<AnimatedDotProps> = ({
  isActive,
  activeIndex,
  index,
}) => {
  const dotStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      activeIndex,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8],
      Extrapolation.CLAMP,
    );
    const opacityValue = interpolate(
      activeIndex,
      [index - 1, index, index + 1],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale: withTiming(scaleValue) }],
      opacity: withTiming(opacityValue),
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        isActive && styles.dotActive,
        dotStyle,
      ]}
    />
  );
};
