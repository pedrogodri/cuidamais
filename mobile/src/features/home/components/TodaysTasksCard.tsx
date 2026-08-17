import { View } from 'react-native';
import { Body, Caption, H3 } from '@/shared/ui/Typography';
import type { MockTask } from '../mockData';

interface TodaysTasksCardProps {
  tasks: MockTask[];
}

export function TodaysTasksCard({ tasks }: TodaysTasksCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <H3>Tarefas de hoje</H3>
      <View className="gap-3">
        {tasks.map((task) => (
          <View key={task.id} className="flex-row items-center gap-3">
            <Caption className="font-mono">{task.time}</Caption>
            <Body className="font-body-medium flex-1 text-neutral-900">{task.title}</Body>
            {task.priority === 'high' ? (
              <View className="rounded-pill bg-amber-100 px-3 py-1">
                <Caption className="font-body-medium text-amber-700">Alta prioridade</Caption>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
