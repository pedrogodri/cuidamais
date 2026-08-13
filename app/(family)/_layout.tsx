import { Tabs } from 'expo-router';

export default function FamilyLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Buscar' }} />
    </Tabs>
  );
}
