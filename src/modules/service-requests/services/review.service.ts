import { apiClient } from '@/shared/services/api-client';

export type CreateReviewParams = {
  serviceRequestId: string;
  rating: number;
  comment?: string;
};

export const ReviewService = {
  async create(params: CreateReviewParams): Promise<void> {
    await apiClient.post('/bff/reviews', params);
  },
};
