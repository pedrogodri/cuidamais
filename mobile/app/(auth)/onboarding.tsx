import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Button } from '@/shared/ui/Button';
import { PageDots } from '@/shared/ui/PageDots';
import { BodyLarge, H1 } from '@/shared/ui/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    icon: 'search-outline',
    title: 'Encontre cuidadores verificados perto de você',
    description:
      'Perfis avaliados por outras famílias, com verificação de identidade e documentos.',
  },
  {
    icon: 'medkit-outline',
    title: 'Acompanhe remédios e cuidados em um só lugar',
    description: 'Lembretes de dose, agenda de atendimentos e histórico sempre à mão.',
  },
  {
    icon: 'people-circle-outline',
    title: 'Fique conectado com quem cuida — mesmo à distância',
    description: 'Chat, notificações e SOS para toda a família acompanhar o cuidado juntos.',
  },
];

interface OnboardingSlideProps {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  topPadding: number;
}

function OnboardingSlide({ slide, index, scrollX, topPadding }: OnboardingSlideProps) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
    return {
      opacity: interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(scrollX.value, input, [0.92, 1, 0.92], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View style={{ width: SCREEN_WIDTH, paddingTop: topPadding }} className="flex-1 px-4">
      <Animated.View style={[{ height: '55%' }, style]} className="items-center justify-center">
        <View className="h-48 w-48 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name={slide.icon} size={72} color="#1C5D52" />
        </View>
      </Animated.View>
      <Animated.View style={[{ paddingTop: 32 }, style]} className="gap-4">
        <H1>{slide.title}</H1>
        <BodyLarge className="text-neutral-700">{slide.description}</BodyLarge>
      </Animated.View>
    </View>
  );
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const lastSlideProgress = useSharedValue(0);
  const buttonFlash = useSharedValue(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    lastSlideProgress.value = withTiming(isLastSlide ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.ease),
    });
    buttonFlash.value = withSequence(
      withTiming(0.15, { duration: 90, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 160, easing: Easing.out(Easing.ease) }),
    );
  }, [isLastSlide, lastSlideProgress, buttonFlash]);

  const pularStyle = useAnimatedStyle(() => ({ opacity: 1 - lastSlideProgress.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonFlash.value }));

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(nextIndex);
  }

  function goToSignup() {
    router.replace('/(auth)/signup');
  }

  function handlePrimaryAction() {
    if (isLastSlide) {
      goToSignup();
      return;
    }
    const nextX = (activeIndex + 1) * SCREEN_WIDTH;
    runOnUI(() => {
      'worklet';
      scrollTo(scrollRef, nextX, 0, true);
    })();
  }

  return (
    <View className="flex-1 bg-neutral-0">
      <Animated.View
        pointerEvents={isLastSlide ? 'none' : 'auto'}
        className="absolute right-4 z-10"
        style={[{ top: insets.top + 12 }, pularStyle]}
      >
        <Pressable accessibilityRole="button" onPress={goToSignup}>
          <Text className="font-body-medium text-caption text-neutral-500">Pular</Text>
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide
            key={slide.title}
            slide={slide}
            index={index}
            scrollX={scrollX}
            topPadding={insets.top + 48}
          />
        ))}
      </Animated.ScrollView>

      <View className="gap-6 px-4 pt-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="items-center">
          <PageDots count={SLIDES.length} scrollX={scrollX} slideWidth={SCREEN_WIDTH} />
        </View>
        <Animated.View style={buttonStyle}>
          <Button
            label={isLastSlide ? 'Começar' : 'Avançar'}
            variant={isLastSlide ? 'primary' : 'secondary'}
            onPress={handlePrimaryAction}
          />
        </Animated.View>
      </View>
    </View>
  );
}
