import { TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/shared/constants';
import { moderateScale, scale } from '@/shared/utils/scale';

function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      hitSlop={8}
      style={{ marginLeft: scale(4) }}
    >
      <Ionicons
        name="chevron-back"
        size={moderateScale(26, 0.3)}
        color={theme.colors.primary.DEFAULT}
      />
    </TouchableOpacity>
  );
}

const renderBackButton = () => <BackButton />;

export default function ProvidersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerStyle: { backgroundColor: theme.colors.background.DEFAULT },
          headerTintColor: theme.colors.primary.DEFAULT,
          headerTitleStyle: {
            fontWeight: theme.typography.fontWeight.semibold as any,
            fontSize: moderateScale(17, 0.3),
            color: theme.colors.text.primary,
          },
          headerShadowVisible: false,
          headerLeft: renderBackButton,
        }}
      />
    </Stack>
  );
}
