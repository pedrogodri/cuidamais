import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Body, Caption, H3 } from '@/shared/ui/Typography';
import type { MockReview } from '../mockCaregiverProfile';

interface ReviewsListProps {
  reviews: MockReview[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <H3>Avaliações</H3>

      {reviews.length === 0 ? (
        <Body className="text-neutral-500">Sem avaliações ainda.</Body>
      ) : (
        <View className="gap-4">
          {reviews.map((review) => (
            <View key={review.id} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Caption className="font-body-medium text-neutral-900">{review.author}</Caption>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={12} color="#A9721F" />
                  <Caption>{review.rating}</Caption>
                </View>
              </View>
              <Body className="text-neutral-700">{review.comment}</Body>
              <Caption className="text-neutral-500">{review.date}</Caption>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
