import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { H1 } from '@/shared/ui/Typography';

interface FormErrors {
  name?: string;
  contact?: string;
  password?: string;
}

export default function Signup() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit() {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = 'Informe seu nome completo.';
    if (!contact.trim()) nextErrors.contact = 'Informe um e-mail ou telefone.';
    if (password.length < 6) nextErrors.password = 'A senha precisa ter pelo menos 6 caracteres.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Account creation is profile-neutral: a person can hold caregiver and
    // family profiles on the same account, so profile choice happens after
    // signup rather than tagging the account itself.
    router.push('/(auth)/profile-choice');
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-0"
      contentContainerClassName="px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <H1>Criar conta</H1>

      <View className="gap-4 pt-8">
        <TextField
          label="Nome completo"
          placeholder="Maria Silva"
          autoComplete="name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
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
          placeholder="Crie uma senha"
          isPassword
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
      </View>

      <View className="pt-8">
        <Button label="Criar conta" onPress={handleSubmit} />
      </View>

      <View className="flex-row items-center gap-3 py-6">
        <View className="h-px flex-1 bg-neutral-200" />
        <Text className="font-body text-caption text-neutral-500">ou continue com</Text>
        <View className="h-px flex-1 bg-neutral-200" />
      </View>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-sm border border-neutral-200"
        >
          <Ionicons name="logo-google" size={20} color="#26302E" />
          <Text className="font-body-medium text-body text-neutral-900">Google</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-sm border border-neutral-200"
        >
          <Ionicons name="logo-apple" size={20} color="#26302E" />
          <Text className="font-body-medium text-body text-neutral-900">Apple</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="link"
        className="items-center pt-8"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="font-body text-body text-petrol-500 underline">Já tem conta? Entrar</Text>
      </Pressable>
    </ScrollView>
  );
}
