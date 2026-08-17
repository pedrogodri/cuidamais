import { Text, View } from 'react-native';
import type { MockTask } from '../mockData';

interface TodaysTasksCardProps {
  tasks: MockTask[];
}

export function TodaysTasksCard({ tasks }: TodaysTasksCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <Text className="font-display-medium text-h3 text-neutral-900">Tarefas de hoje</Text>
      <View className="gap-3">
        {tasks.map((task) => (
          <View key={task.id} className="flex-row items-center gap-3">
            <Text className="font-mono text-caption text-neutral-500">{task.time}</Text>
            <Text className="font-body-medium text-body flex-1 text-neutral-900">{task.title}</Text>
            {task.priority === 'high' ? (
              <View className="rounded-pill bg-amber-100 px-3 py-1">
                <Text className="font-body-medium text-caption text-amber-700">
                  Alta prioridade
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
