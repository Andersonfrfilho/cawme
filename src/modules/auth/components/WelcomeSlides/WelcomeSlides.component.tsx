import { View, Text, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { styles } from "./styles";
import { AnimatedDot } from "./AnimatedDot.component";
import type { WelcomeSlidesProps } from "./types";

const { width } = Dimensions.get("window");

export const WelcomeSlides: React.FC<WelcomeSlidesProps> = ({
  slides,
  activeIndex,
  onIndexChange,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          onIndexChange(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.icon as any}
                size={scale(64)}
                color={theme.colors.primary.DEFAULT}
              />
            </View>
            <Text style={styles.headline}>{item.headline}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <AnimatedDot
            key={index}
            isActive={index === activeIndex}
            activeIndex={activeIndex}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};
