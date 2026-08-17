import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface UpcomingAppointmentCardProps {
  specialty: string;
  doctorName: string;
  date: string;
  time: string;
  location: string;
}

export function UpcomingAppointmentCard({
  specialty,
  doctorName,
  date,
  time,
  location,
}: UpcomingAppointmentCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <Text className="font-display-medium text-h3 text-neutral-900">Próxima consulta</Text>
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-vinculo-100">
          <Ionicons name="calendar-outline" size={20} color="#A8455F" />
        </View>
        <View className="flex-1">
          <Text className="font-body-medium text-body text-neutral-900">{specialty}</Text>
          <Text className="font-body text-caption text-neutral-500">{doctorName}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-clear-outline" size={14} color="#5C6B67" />
          <Text className="font-body text-caption text-neutral-700">
            {date} · {time}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#5C6B67" />
          <Text className="font-body text-caption text-neutral-700">{location}</Text>
        </View>
      </View>
    </View>
  );
}
