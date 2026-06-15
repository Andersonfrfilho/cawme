import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { TimeWheelPickerProps } from './types';
import { ITEM_HEIGHT, styles } from './styles';

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

type WheelDrumProps = {
  items: string[];
  initialIndex: number;
  minIndex: number;
  onIndexChange: (index: number) => void;
};

const WheelDrum: React.FC<WheelDrumProps> = ({ items, initialIndex, minIndex, onIndexChange }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const lastReported = useRef(initialIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeIndex < minIndex) {
      scrollRef.current?.scrollTo({ y: minIndex * ITEM_HEIGHT, animated: true });
      setActiveIndex(minIndex);
      if (minIndex !== lastReported.current) {
        lastReported.current = minIndex;
        onIndexChange(minIndex);
      }
    }
  }, [minIndex]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const raw = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(minIndex, Math.min(raw, items.length - 1));

      if (clamped !== raw) {
        // animated: false prevents re-entrant onMomentumScrollEnd events that
        // would occur with animated: true and can freeze the UI when the user
        // scrolls past the minimum index.
        scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: false });
      }

      setActiveIndex(clamped);
      if (clamped !== lastReported.current) {
        lastReported.current = clamped;
        onIndexChange(clamped);
      }
    },
    [items.length, onIndexChange, minIndex],
  );

  return (
    <View style={styles.drumWrapper}>
      <View style={styles.selectionBar} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={styles.drumContent}
        style={styles.drum}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => (
          <View key={item} style={styles.drumItem}>
            <Text
              style={[
                styles.drumItemText,
                index === activeIndex && styles.drumItemTextActive,
                index < minIndex && styles.drumItemTextDisabled,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({ value, onChange, minValue }) => {
  const parts = value.split(':');
  const initHourIndex = Number.parseInt(parts[0] ?? '9', 10);
  const initMinuteStr = (parts[1] ?? '00').substring(0, 2);
  const initMinuteIndex = Math.max(0, MINUTES.indexOf(initMinuteStr));

  const [currentHourIndex, setCurrentHourIndex] = useState(initHourIndex);
  const currentMinuteIndexRef = useRef(initMinuteIndex);

  const minMinutes = minValue ? toMinutes(minValue) + 15 : 0;
  const minHourIndex = minMinutes > 0 ? Math.floor(minMinutes / 60) : 0;
  const minMinuteForHour = minMinutes % 60;
  const rawMinMinuteIndex = MINUTES.indexOf(String(minMinuteForHour).padStart(2, '0'));
  const minMinuteIndex = Math.max(0, rawMinMinuteIndex);

  const minutesMinIndex = currentHourIndex > minHourIndex ? 0 : minMinuteIndex;

  const handleHourChange = useCallback(
    (index: number) => {
      setCurrentHourIndex(index);
      onChange(`${HOURS[index]}:${MINUTES[currentMinuteIndexRef.current]}`);
    },
    [onChange],
  );

  const handleMinuteChange = useCallback(
    (index: number) => {
      currentMinuteIndexRef.current = index;
      onChange(`${HOURS[currentHourIndex]}:${MINUTES[index]}`);
    },
    [onChange, currentHourIndex],
  );

  return (
    <View style={styles.picker}>
      <WheelDrum
        items={HOURS}
        initialIndex={initHourIndex}
        minIndex={minHourIndex}
        onIndexChange={handleHourChange}
      />
      <Text style={styles.separator}>:</Text>
      <WheelDrum
        items={MINUTES}
        initialIndex={initMinuteIndex}
        minIndex={minutesMinIndex}
        onIndexChange={handleMinuteChange}
      />
    </View>
  );
};
