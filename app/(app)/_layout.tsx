import { Stack } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function AppLayout() {
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />
  );
}
