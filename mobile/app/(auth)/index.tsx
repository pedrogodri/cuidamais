import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

const AUTO_ADVANCE_MS = 1500;

export default function Splash() {
  const hasNavigated = useRef(false);

  function goToOnboarding() {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    router.replace('/(auth)/onboarding');
  }

  useEffect(() => {
    const timer = setTimeout(goToOnboarding, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable
      className="flex-1 items-center justify-center bg-petrol-500"
      onPress={goToOnboarding}
    >
      <Image
        source={require('../../assets/splash-icon.png')}
        className="h-28 w-28"
        resizeMode="contain"
        accessibilityLabel="CuidaMais"
      />
      <View className="absolute bottom-16">
        <ActivityIndicator color="#FAF8F5" />
      </View>
    </Pressable>
  );
}
