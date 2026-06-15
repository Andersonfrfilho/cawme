import { useCallback, useRef, useState } from "react";
import { Animated } from "react-native";

const TOAST_DURATION_MS = 3000;

export type ToastType = "success" | "error";

export type ToastState = {
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      setToast({ message, type });
      toastOpacity.setValue(0);
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      dismissTimer.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, TOAST_DURATION_MS);
    },
    [toastOpacity],
  );

  return { toast, toastOpacity, showToast };
}
