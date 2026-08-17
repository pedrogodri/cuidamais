import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { colors } from './theme';

interface PageDotsProps {
  count: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

function Dot({ index, scrollX, slideWidth }: DotProps) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];
    return {
      width: interpolate(scrollX.value, input, [8, 24, 8], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(scrollX.value, input, [
        colors.neutral200,
        colors.petrol500,
        colors.neutral200,
      ]),
    };
  });

  return <Animated.View style={[{ height: 8, borderRadius: 999 }, style]} />;
}

export function PageDots({ count, scrollX, slideWidth }: PageDotsProps) {
  return (
    <View accessibilityElementsHidden className="flex-row gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} slideWidth={slideWidth} />
      ))}
    </View>
  );
}
