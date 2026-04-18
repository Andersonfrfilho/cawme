import { useEffect } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/shared/constants';

export function ConflictIllustration() {
  const left = useSharedValue(0);
  const right = useSharedValue(0);

  useEffect(() => {
    left.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(3)) }),
      ),
      -1,
      false,
    );
    right.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(3)) }),
      ),
      -1,
      false,
    );
  }, []);

  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: left.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: right.value }] }));

  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={56} fill={palette.yellow[50]} />
      <Animated.View style={[{ position: 'absolute', top: 25, left: 8 }, leftStyle]}>
        <Svg width={46} height={70} viewBox="0 0 46 70">
          <Path
            d="M 23 5 L 41 65 L 23 52 L 5 65 Z"
            fill={palette.yellow[400]}
            stroke={palette.yellow[600]}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 25, left: 66 }, rightStyle]}>
        <Svg width={46} height={70} viewBox="0 0 46 70">
          <Path
            d="M 23 5 L 41 65 L 23 52 L 5 65 Z"
            fill={palette.yellow[500]}
            stroke={palette.yellow[700]}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Svg>
  );
}
