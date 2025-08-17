import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create-room" options={{ headerShown: false }} />
      <Stack.Screen name="join-room" options={{ headerShown: false }} />
      <Stack.Screen name="room/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}