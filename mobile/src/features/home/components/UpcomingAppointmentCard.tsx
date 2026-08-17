import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Body, Caption, H3 } from '@/shared/ui/Typography';

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
      <H3>Próxima consulta</H3>
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-vinculo-100">
          <Ionicons name="calendar-outline" size={20} color="#A8455F" />
        </View>
        <View className="flex-1">
          <Body className="font-body-medium text-neutral-900">{specialty}</Body>
          <Caption>{doctorName}</Caption>
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-clear-outline" size={14} color="#5C6B67" />
          <Caption className="text-neutral-700">
            {date} · {time}
          </Caption>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#5C6B67" />
          <Caption className="text-neutral-700">{location}</Caption>
        </View>
      </View>
    </View>
  );
}
