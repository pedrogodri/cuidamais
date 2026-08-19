import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaregiverListItem } from '@/features/caregiver-search/components/CaregiverListItem';
import { SearchFilters } from '@/features/caregiver-search/components/SearchFilters';
import { MOCK_CAREGIVERS } from '@/features/caregiver-search/mockCaregivers';
import { Body } from '@/shared/ui/Typography';

export default function Buscar() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const specialties = useMemo(
    () => Array.from(new Set(MOCK_CAREGIVERS.flatMap((caregiver) => caregiver.specialties))),
    [],
  );

  const results = useMemo(() => {
    return MOCK_CAREGIVERS.filter((caregiver) => {
      const matchesQuery = caregiver.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesSpecialty =
        !selectedSpecialty || caregiver.specialties.includes(selectedSpecialty);
      return matchesQuery && matchesSpecialty;
    });
  }, [query, selectedSpecialty]);

  return (
    <ScrollView
      className="flex-1 bg-neutral-0"
      contentContainerClassName="gap-4 px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <SearchFilters
        query={query}
        onQueryChange={setQuery}
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSelectSpecialty={setSelectedSpecialty}
      />

      {results.length === 0 ? (
        <View className="items-center rounded-md border border-dashed border-neutral-300 bg-white p-6">
          <Body className="text-center text-neutral-500">Nenhum cuidador encontrado.</Body>
        </View>
      ) : (
        <View className="gap-3">
          {results.map((caregiver) => (
            <CaregiverListItem
              key={caregiver.id}
              caregiver={caregiver}
              onPress={() => router.push(`/(shared)/caregiver/${caregiver.id}`)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
