import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { BottomTabBarProps, BottomTabDescriptor } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants';
import { scale, verticalScale } from '@/shared/utils/scale';

const TAB_CONTENT_HEIGHT = verticalScale(56);
const CENTER_SIZE = scale(52);
const CENTER_LIFT = verticalScale(14);

const IDLE_BG = theme.colors.background.elevated as string;
const ACTIVE_BG = theme.palette.blue[500] as string;
const IDLE_BORDER = theme.colors.border.DEFAULT as string;

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][number];
  descriptor: BottomTabDescriptor;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({ route, descriptor, isFocused, onPress }: TabItemProps) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, { damping: 18, stiffness: 240 });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.4, 1]) }],
  }));

  const color = isFocused ? theme.palette.blue[500] : theme.colors.text.tertiary;

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.7} testID={`tab-${route.name}`}>
      <Animated.View style={[styles.pill, pillStyle]} />
      {descriptor.options.tabBarIcon?.({
        color,
        size: theme.metrics.iconSize.md,
        focused: isFocused,
      })}
    </TouchableOpacity>
  );
}

function CenterTabItem({ route, descriptor, isFocused, onPress }: TabItemProps) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, { damping: 16, stiffness: 220 });
  }, [isFocused]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.88, 1]) }],
    backgroundColor: interpolateColor(progress.value, [0, 1], [IDLE_BG, ACTIVE_BG]),
    borderColor: interpolateColor(progress.value, [0, 1], [IDLE_BORDER, ACTIVE_BG]),
  }));

  const color = isFocused ? theme.palette.neutral[0] : theme.colors.text.secondary;

  return (
    <View style={styles.centerWrapper}>
      <Animated.View style={[styles.centerButton, buttonStyle]}>
        <TouchableOpacity style={styles.centerTouchable} onPress={onPress} activeOpacity={0.85} testID={`tab-${route.name}`}>
          {descriptor.options.tabBarIcon?.({
            color,
            size: theme.metrics.iconSize.lg,
            focused: isFocused,
          })}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

interface CustomBottomTabBarProps extends BottomTabBarProps {
  hiddenRoutes?: string[];
}

export function BottomTabBar({ state, descriptors, navigation, hiddenRoutes = [] }: CustomBottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const hiddenSet = new Set(hiddenRoutes);

  const visibleRoutes = state.routes.filter((route) => !hiddenSet.has(route.name));
  const centerRouteKey = visibleRoutes[Math.floor(visibleRoutes.length / 2)]?.key;

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {visibleRoutes.map((route) => {
          const descriptor = descriptors[route.key];
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const isCenter = route.key === centerRouteKey;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (isCenter) {
            return (
              <CenterTabItem
                key={route.key}
                route={route}
                descriptor={descriptor}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          }

          return (
            <TabItem
              key={route.key}
              route={route}
              descriptor={descriptor}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.neutral[0],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
    shadowColor: theme.palette.neutral[900],
    shadowOffset: { width: 0, height: -verticalScale(1) },
    shadowOpacity: 0.06,
    shadowRadius: scale(4),
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
    height: TAB_CONTENT_HEIGHT,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pill: {
    position: 'absolute',
    top: 0,
    width: scale(28),
    height: verticalScale(3),
    borderRadius: theme.radii.full,
    backgroundColor: theme.palette.blue[500],
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: TAB_CONTENT_HEIGHT + CENTER_LIFT,
    marginTop: -CENTER_LIFT,
  },
  centerButton: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: theme.radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(6),
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    shadowColor: theme.palette.neutral[900],
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(6),
    elevation: 4,
  },
  centerTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
