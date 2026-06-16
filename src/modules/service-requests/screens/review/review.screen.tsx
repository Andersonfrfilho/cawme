import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReviewService } from "@/modules/service-requests/services/review.service";
import { useLoading } from "@/shared/hooks/useLoading";
import { useToast } from "@/shared/hooks/useToast";
import { Toast } from "@/shared/components/Toast";
import { useLocale, LocaleKeys } from "@/shared/locales";
import { theme } from "@/shared/constants";
import { moderateScale, scale } from "@/shared/utils/scale";
import styles from "./styles";

type ReviewScreenParams = {
  serviceRequestId: string;
  serviceName: string;
};

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { serviceRequests } = useLocale<LocaleKeys>();
  const { serviceRequestId, serviceName } = useLocalSearchParams<ReviewScreenParams>();
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { toast, toastOpacity, showToast } = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  async function handleSubmit(): Promise<void> {
    if (rating === 0) return;
    showLoading();
    try {
      await ReviewService.create({ serviceRequestId, rating, comment: comment.trim() || undefined });
      showToast(serviceRequests.reviewSuccess, "success");
      setTimeout(() => router.back(), 1200);
    } catch {
      showToast(serviceRequests.reviewError, "error");
    } finally {
      hideLoading();
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + moderateScale(16, 0.5) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.palette.neutral[0]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceRequests.reviewTitle}</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.serviceCard}>
          <Text style={styles.serviceLabel}>Serviço</Text>
          <Text style={styles.serviceName}>{serviceName}</Text>
        </View>

        <Text style={styles.sectionTitle}>{serviceRequests.reviewRatingLabel}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starButton}
              onPress={() => setRating(star)}
              hitSlop={8}
            >
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={scale(36)}
                color={star <= rating ? theme.colors.accent.yellow : theme.colors.border.DEFAULT}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.commentLabel}>{serviceRequests.reviewCommentLabel}</Text>
        <TextInput
          style={styles.commentInput}
          placeholder={serviceRequests.reviewCommentPlaceholder}
          placeholderTextColor={theme.colors.text.tertiary}
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity
          style={[styles.submitButton, (rating === 0 || isLoading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || isLoading}
        >
          <Text style={styles.submitButtonText}>{serviceRequests.reviewSubmitButton}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Toast toast={toast} opacity={toastOpacity} />
    </View>
  );
}
