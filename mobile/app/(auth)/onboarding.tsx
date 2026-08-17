import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === SLIDES.length - 1;

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
    scrollRef.current?.scrollTo({ x: (activeIndex + 1) * SCREEN_WIDTH, animated: true });
  }

  return (
    <View className="flex-1 bg-neutral-0">
      {!isLastSlide ? (
        <Pressable
          accessibilityRole="button"
          className="absolute right-4 z-10"
          style={{ top: insets.top + 12 }}
          onPress={goToSignup}
        >
          <Text className="font-body-medium text-caption text-neutral-500">Pular</Text>
        </Pressable>
      ) : null}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.title}
            style={{ width: SCREEN_WIDTH, paddingTop: insets.top + 48 }}
            className="flex-1 px-4"
          >
            <View className="h-[55%] items-center justify-center">
              <View className="h-48 w-48 items-center justify-center rounded-full bg-petrol-100">
                <Ionicons name={slide.icon} size={72} color="#1C5D52" />
              </View>
            </View>
            <View className="gap-4 pt-8">
              <H1>{slide.title}</H1>
              <BodyLarge className="text-neutral-700">{slide.description}</BodyLarge>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="gap-6 px-4 pt-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="items-center">
          <PageDots count={SLIDES.length} activeIndex={activeIndex} />
        </View>
        <Button
          label={isLastSlide ? 'Começar' : 'Avançar'}
          variant={isLastSlide ? 'primary' : 'secondary'}
          onPress={handlePrimaryAction}
        />
      </View>
    </View>
  );
}
