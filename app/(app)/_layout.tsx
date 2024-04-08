import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import { Chat, DeepPartial, OverlayProvider, Theme } from 'stream-chat-expo';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';
import { useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useCreateProfile } from '@/lib/mutations';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Person } from '@/constants/types';
import { useData } from '@/hooks/useData';
import { StatusBar } from 'expo-status-bar';
import { StreamVideoClient, User } from '@stream-io/video-react-native-sdk';

const api = 'cnvc46pm8uq9';
const client = StreamChat.getInstance(api);

export default function AppLayout() {
  const { id, getValues, user } = useData();
  console.log('🚀 ~ AppLayout ~ user:', user?.streamToken);
  const userProfile: User = {
    id: user?.id as string,
    name: user?.name as string,
    image: user?.avatar as string,
  };
  const token: string = user?.streamToken as string;

  useEffect(() => {
    console.log('Use effect working');

    const connectUser = async () => {
      try {
        console.log('Connected to stream 1');

        await client.connectUser(
          {
            id: user?.id as string,
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
  }, [user]);

  // useEffect(() => {
  //     if (!data?.profile) {
  //     return;
  //   }
  //   console.log('Use effect working');
  //   const { profile } = data;
  //   if (!profile) return;
  //   const onConnectUser = async () => {
  //     await clientVideo.connectUser(
  //       {
  //         id: profile.userId.toString(),
  //         name: profile.name,
  //         image: profile.avatar,
  //       },
  //       profile?.streamToken
  //     );
  //   };

  //   onConnectUser();

  //   return () => {
  //     clientVideo.disconnectUser();
  //   };
  // }, [data?.profile?.userId, clientVideo]);
  const chatTheme: DeepPartial<Theme> = {
    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
    },
  };

  const getUserStored = useCallback(() => {
    getValues();
  }, []);

  useEffect(() => {
    getUserStored();
  }, []);

  if (!id || !user?.id) {
    return <Redirect href={'/'} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
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
