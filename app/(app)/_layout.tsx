import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import { Chat, DeepPartial, OverlayProvider, Theme } from 'stream-chat-expo';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useCreateProfile } from '@/lib/mutations';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Person } from '@/constants/types';
import { useData } from '@/hooks/useData';

const client = StreamChat.getInstance('cnvc46pm8uq9');

export default function AppLayout() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { userData } = useData();
  console.log('🚀 ~ AppLayout ~ userData:', userData);

  const { data, error, isPending, refetch, isRefetching, isPaused } =
    useProfile(userId);

  // useEffect(() => {
  //   if (person?.user) {
  //     const connectUser = async () => {
  //       try {
  //         console.log(person);
  //         await client.connectUser(
  //           {
  //             id: person?.user.user_id as string,
  //             name: person?.user.name as any,
  //             image: person?.user.avatarUrl,
  //           },
  //           person?.user.streamToken
  //         );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     connectUser();

  //     return () => {
  //       client.disconnectUser();
  //       console.log('User disconnected');
  //     };
  //   }
  // }, [person?.user]);

  if (error || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending || !isLoaded) {
    return <LoadingComponent />;
  }

  if (isLoaded && !isSignedIn) {
    return <Redirect href="/login" />;
  }

  const chatTheme: DeepPartial<Theme> = {
    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
    },
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider value={{ style: chatTheme }}>
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
