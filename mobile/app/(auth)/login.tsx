import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/app-providers/AuthProvider';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { H1 } from '@/shared/ui/Typography';

interface FormErrors {
  contact?: string;
  password?: string;
}

export default function Login() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (!contact.trim()) nextErrors.contact = 'Informe seu e-mail ou telefone.';
    if (!password) nextErrors.password = 'Informe sua senha.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // No backend to authenticate against yet — a mock token is enough to
    // populate a real session so profile-guarded routes become reachable.
    await signIn({ token: `mock-token-${Date.now()}` });
    router.replace('/(shared)/(tabs)/home');
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-0"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <H1>Entrar</H1>

      <View className="gap-4 pt-8">
        <TextField
          label="E-mail ou telefone"
          placeholder="maria@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={contact}
          onChangeText={setContact}
          error={errors.contact}
        />
        <TextField
          label="Senha"
          placeholder="Sua senha"
          isPassword
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
      </View>

      <Pressable accessibilityRole="link" className="items-end pt-3">
        <Text className="font-body-medium text-caption text-neutral-700">Esqueci minha senha</Text>
      </Pressable>

      <View className="pt-8">
        <Button label="Entrar" onPress={handleSubmit} />
      </View>

      <Pressable
        accessibilityRole="link"
        className="items-center pt-8"
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text className="font-body text-body text-petrol-500 underline">
          Não tem conta? Cadastre-se
        </Text>
      </Pressable>
    </ScrollView>
  );
}
