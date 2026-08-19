import { Pressable, View } from 'react-native';
import { TextField } from '@/shared/ui/TextField';
import { Caption } from '@/shared/ui/Typography';

interface SearchFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  specialties: string[];
  selectedSpecialty: string | null;
  onSelectSpecialty: (specialty: string | null) => void;
}

export function SearchFilters({
  query,
  onQueryChange,
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
}: SearchFiltersProps) {
  return (
    <View className="gap-3">
      <TextField
        label="Buscar cuidador"
        placeholder="Nome do cuidador"
        value={query}
        onChangeText={onQueryChange}
      />
      <View className="flex-row flex-wrap gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedSpecialty === null }}
          onPress={() => onSelectSpecialty(null)}
          className={`rounded-pill px-3 py-1.5 ${
            selectedSpecialty === null ? 'bg-petrol-100' : 'bg-neutral-100'
          }`}
        >
          <Caption
            className={`font-body-medium ${
              selectedSpecialty === null ? 'text-petrol-700' : 'text-neutral-700'
            }`}
          >
            Todos
          </Caption>
        </Pressable>
        {specialties.map((specialty) => {
          const selected = selectedSpecialty === specialty;
          return (
            <Pressable
              key={specialty}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelectSpecialty(specialty)}
              className={`rounded-pill px-3 py-1.5 ${selected ? 'bg-petrol-100' : 'bg-neutral-100'}`}
            >
              <Caption
                className={`font-body-medium ${selected ? 'text-petrol-700' : 'text-neutral-700'}`}
              >
                {specialty}
              </Caption>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
