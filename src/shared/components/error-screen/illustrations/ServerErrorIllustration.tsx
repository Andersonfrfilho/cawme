import { useEffect } from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/shared/constants';

export function ServerErrorIllustration() {
  const rotation = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
    shake.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 80 }),
        withTiming(3, { duration: 80 }),
        withTiming(-2, { duration: 80 }),
        withTiming(2, { duration: 80 }),
        withTiming(0, { duration: 80 }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, []);

  const gearStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View style={shakeStyle}>
      <Svg width={120} height={120} viewBox="0 0 120 120">
        <Circle cx={60} cy={60} r={56} fill={palette.error[50]} />
        <Rect x={32} y={38} width={56} height={44} rx={6} fill={palette.neutral[200]} stroke={palette.neutral[400]} strokeWidth={2} />
        <Rect x={32} y={38} width={56} height={14} rx={6} fill={palette.neutral[400]} />
        <Circle cx={42} cy={45} r={3} fill={palette.error[500]} />
        <Circle cx={52} cy={45} r={3} fill={palette.yellow[400]} />
        <Circle cx={62} cy={45} r={3} fill={palette.green[400]} />
      </Svg>
      <Animated.View
        style={[
          gearStyle,
          { position: 'absolute', bottom: 8, right: 8, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Svg width={36} height={36} viewBox="0 0 36 36">
          <Path
            d="M18 12 L20 8 L16 8 Z M24 14 L28 12 L26 16 Z M26 20 L30 20 L28 24 Z M22 24 L24 28 L20 28 Z M14 24 L12 28 L16 28 Z M10 20 L6 20 L8 24 Z M10 16 L6 14 L8 12 Z M14 12 L12 8 L16 8 Z"
            fill={palette.error[500]}
          />
          <Circle cx={18} cy={18} r={6} fill={palette.error[500]} />
          <Circle cx={18} cy={18} r={3} fill={palette.error[50]} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
