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
  const { user } = useData();

  useEffect(() => {
    console.log('Use effect working');

    const connectUser = async () => {
      try {
        console.log('Connected to stream 1');

        await client.connectUser(
          {
            id: user?.id.toString() as string,
            name: user?.name,
            image: user?.avatar,
          },
          user?.streamToken
        );
        console.log('Connected to stream 2');
      } catch (error) {
        console.log(error);
      }
    };

    connectUser();
    return () => {
      client.disconnectUser();
      console.log('User disconnected');
    };
  }, []);

  const chatTheme: DeepPartial<Theme> = {
    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
    },
  };

  if (!user) {
    return <Redirect href="/login" />;
  }
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
