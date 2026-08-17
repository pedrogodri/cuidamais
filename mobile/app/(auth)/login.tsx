import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { H1 } from '@/shared/ui/Typography';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    // Signup/login network integration is out of scope for this design pass.
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
        />
        <TextField
          label="Senha"
          placeholder="Sua senha"
          isPassword
          value={password}
          onChangeText={setPassword}
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
        onPress={() => router.push('/(auth)/profile-choice')}
      >
        <Text className="font-body text-body text-petrol-500 underline">
          Não tem conta? Cadastre-se
        </Text>
      </Pressable>
    </ScrollView>
  );
}
