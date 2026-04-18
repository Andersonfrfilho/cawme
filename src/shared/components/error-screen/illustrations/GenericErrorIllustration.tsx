import { useEffect } from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { palette } from '@/shared/constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function GenericErrorIllustration() {
  const pulse = useSharedValue(56);
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(62, { duration: 700 }), withTiming(56, { duration: 700 })),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0.08, { duration: 700 }), withTiming(0.2, { duration: 700 })),
      -1,
      true,
    );
  }, []);

  const pulseProps = useAnimatedProps(() => ({
    r: pulse.value,
    opacity: opacity.value,
  }));

  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      <AnimatedCircle animatedProps={pulseProps} cx={60} cy={60} fill={palette.error[500]} />
      <Circle cx={60} cy={60} r={52} fill={palette.error[50]} />
      <Path
        d="M 60 30 L 90 82 L 30 82 Z"
        fill={palette.yellow[400]}
        stroke={palette.yellow[600]}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Line x1="60" y1="52" x2="60" y2="68" stroke={palette.yellow[800]} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={60} cy={75} r={3} fill={palette.yellow[800]} />
    </Svg>
  );
}
