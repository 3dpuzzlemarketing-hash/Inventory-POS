import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#0f172a' },
        tabBarActiveTintColor: '#2563eb'
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inventory', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Setup', tabBarLabel: 'Explore' }} />
    </Tabs>
  );
}
