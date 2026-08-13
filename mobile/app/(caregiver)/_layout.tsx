import { Tabs } from 'expo-router';

export default function CaregiverLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
