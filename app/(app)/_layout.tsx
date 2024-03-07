import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';

const API_KEY = 'cnvc46pm8uq9';

const client = StreamChat.getInstance(
  API_KEY,
  '4e4zqvk5ntasfevbnegfj2gn4yuf7sbsayutarfufrpcbgx8s7nenb84ns64jbgt'
);

export default function AppLayout() {
  const { userId } = useAuth();
  const { data, error, isPending, refetch, isRefetching, isPaused } =
    useProfile(userId);
  console.log(data);

  useEffect(() => {
    if (!data) return;

    const user = data.profile[0];
    const connectUser = async () => {
      await client.connectUser(
        {
          id: user?.user_id,
          name: user?.name,
          image: user?.avatarUrl,
        },
        user?.streamToken
      );
    };

    connectUser();

    return () => {
      client.disconnectUser();
    };
  }, [data]);

  if (error || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <Chat client={client}>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          />
        </Chat>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}
