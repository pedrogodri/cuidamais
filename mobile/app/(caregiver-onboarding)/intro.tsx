import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { BodyLarge, H1 } from '@/shared/ui/Typography';

const CHECKLIST: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'document-text-outline', label: 'Documento de identificação' },
  { icon: 'call-outline', label: 'Confirmação de telefone' },
  { icon: 'mail-outline', label: 'Confirmação de e-mail' },
  { icon: 'scan-outline', label: 'Verificação facial' },
];

export default function VerificationIntro() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-neutral-0 px-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        hitSlop={12}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#26302E" />
      </Pressable>

      <ScrollView contentContainerClassName="flex-1 pt-6" showsVerticalScrollIndicator={false}>
        <View className="h-16 w-16 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name="shield-checkmark-outline" size={30} color="#1C5D52" />
        </View>

        <View className="gap-3 pt-6">
          <H1>Verificação de identidade</H1>
          <BodyLarge className="text-neutral-700">
            Para oferecer cuidado profissional pelo CuidaMais, precisamos confirmar quem você é.
            Isso protege as famílias que vão te receber em casa — e protege você também.
          </BodyLarge>
        </View>

        <View className="gap-3 pt-8">
          <Text className="font-body-medium text-caption uppercase tracking-widest text-neutral-500">
            O que vamos pedir
          </Text>
          {CHECKLIST.map((item) => (
            <View
              key={item.label}
              className="flex-row items-center gap-4 rounded-md border border-neutral-200 bg-white px-4 py-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-petrol-100">
                <Ionicons name={item.icon} size={18} color="#1C5D52" />
              </View>
              <Text className="font-body-medium text-body-lg flex-1 text-neutral-900">
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <Text className="pt-6 font-body text-caption text-neutral-500">
          Leva cerca de 5 minutos. Você pode pausar e retomar quando quiser.
        </Text>
      </ScrollView>

      <View className="gap-4 pt-4">
        <Button
          label="Começar verificação"
          onPress={() => router.push('/(caregiver-onboarding)/document-type')}
        />
        <Pressable accessibilityRole="link" className="items-center">
          <Text className="font-body text-body text-petrol-500 underline">
            Por que isso é necessário?
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
