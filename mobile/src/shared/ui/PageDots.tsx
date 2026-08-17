import { View } from 'react-native';

interface PageDotsProps {
  count: number;
  activeIndex: number;
}

export function PageDots({ count, activeIndex }: PageDotsProps) {
  return (
    <View accessibilityElementsHidden className="flex-row gap-2">
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          className={`h-2 rounded-pill ${
            index === activeIndex ? 'w-6 bg-petrol-500' : 'w-2 bg-neutral-200'
          }`}
        />
      ))}
    </View>
  );
}
