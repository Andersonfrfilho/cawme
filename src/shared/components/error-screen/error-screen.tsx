import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, palette } from '@/shared/constants';
import { t } from '@/shared/locales';
import { styles } from './error-screen.styles';
import type { ErrorVariant, ErrorScreenProps } from './error-screen.types';
import {
  NetworkIllustration,
  NotFoundIllustration,
  ConflictIllustration,
  ServerErrorIllustration,
  GenericErrorIllustration,
} from './illustrations';

type VariantConfig = {
  Illustration: () => React.JSX.Element;
  codeColor: string;
  code?: string;
  titleKey: string;
  messageKey: string;
};

const VARIANT_CONFIG: Record<ErrorVariant, VariantConfig> = {
  network: {
    Illustration: NetworkIllustration,
    codeColor: colors.primary.DEFAULT,
    titleKey: 'errors.networkTitle',
    messageKey: 'errors.networkMessage',
  },
  '404': {
    Illustration: NotFoundIllustration,
    codeColor: palette.yellow[500],
    code: '404',
    titleKey: 'errors.notFoundTitle',
    messageKey: 'errors.notFoundMessage',
  },
  '409': {
    Illustration: ConflictIllustration,
    codeColor: palette.yellow[600],
    code: '409',
    titleKey: 'errors.conflictTitle',
    messageKey: 'errors.conflictMessage',
  },
  '500': {
    Illustration: ServerErrorIllustration,
    codeColor: palette.error[500],
    code: '500',
    titleKey: 'errors.serverTitle',
    messageKey: 'errors.serverMessage',
  },
  generic: {
    Illustration: GenericErrorIllustration,
    codeColor: palette.error[500],
    titleKey: 'errors.genericTitle',
    messageKey: 'errors.genericMessage',
  },
};

export function ErrorScreen({ variant, onRetry, onBack, onOther, otherLabel, title, message }: ErrorScreenProps) {
  const config = VARIANT_CONFIG[variant];
  const { Illustration } = config;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(32);
  const illustrationY = useSharedValue(0);
  const codeScale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
    codeScale.value = withDelay(200, withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) }));
    illustrationY.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: illustrationY.value }],
  }));

  const codeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: codeScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[contentStyle, styles.content]}>
        <Animated.View style={[styles.illustrationWrapper, illustrationStyle]}>
          <Illustration />
        </Animated.View>

        {config.code && (
          <Animated.Text style={[styles.codeText, { color: config.codeColor }, codeStyle]}>
            {config.code}
          </Animated.Text>
        )}

        <Text style={styles.title}>{title ?? t(config.titleKey)}</Text>
        <Text style={styles.message}>{message ?? t(config.messageKey)}</Text>

        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: config.codeColor }]}
              onPress={onRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          )}
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>
          )}
          {onOther && otherLabel && (
            <TouchableOpacity style={styles.backButton} onPress={onOther} activeOpacity={0.7}>
              <Text style={styles.backButtonText}>{otherLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
