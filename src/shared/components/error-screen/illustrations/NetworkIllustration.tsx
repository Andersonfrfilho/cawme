import { useEffect } from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/shared/constants';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function NetworkIllustration() {
  const arc1 = useSharedValue(0.3);
  const arc2 = useSharedValue(0.3);
  const arc3 = useSharedValue(0.3);
  const dotScale = useSharedValue(1);

  const pulse = (delay: number) =>
    withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
          withTiming(0.15, { duration: 600, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );

  useEffect(() => {
    arc1.value = pulse(0);
    arc2.value = pulse(200);
    arc3.value = pulse(400);
    dotScale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      true,
    );
  }, []);

  const arc1Props = useAnimatedProps(() => ({ opacity: arc1.value }));
  const arc2Props = useAnimatedProps(() => ({ opacity: arc2.value }));
  const arc3Props = useAnimatedProps(() => ({ opacity: arc3.value }));
  const dotProps = useAnimatedProps(() => ({ r: 5 * dotScale.value } as never));

  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={56} fill={palette.blue[50]} />
      <AnimatedPath
        animatedProps={arc3Props}
        d="M 20 70 Q 60 20 100 70"
        stroke={palette.blue[300]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <AnimatedPath
        animatedProps={arc2Props}
        d="M 30 78 Q 60 40 90 78"
        stroke={palette.blue[400]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <AnimatedPath
        animatedProps={arc1Props}
        d="M 42 86 Q 60 62 78 86"
        stroke={palette.blue[500]}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <AnimatedCircle animatedProps={dotProps} cx={60} cy={96} fill={palette.blue[500]} />
      <Line x1="78" y1="42" x2="96" y2="24" stroke={palette.error[500]} strokeWidth={4} strokeLinecap="round" />
      <Line x1="96" y1="42" x2="78" y2="24" stroke={palette.error[500]} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}
