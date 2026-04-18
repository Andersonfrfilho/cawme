import { useEffect } from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/shared/constants';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function NotFoundIllustration() {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(10, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Svg width={120} height={120} viewBox="0 0 120 120">
        <Circle cx={60} cy={60} r={56} fill={palette.yellow[50]} />
        <Circle cx={52} cy={52} r={22} stroke={palette.yellow[500]} strokeWidth={5} fill="none" />
        <Line
          x1="68"
          y1="68"
          x2="85"
          y2="85"
          stroke={palette.yellow[500]}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <Path
          d="M 46 47 Q 52 43 58 47"
          stroke={palette.yellow[600]}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 46 58 Q 52 62 58 58"
          stroke={palette.yellow[600]}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}
