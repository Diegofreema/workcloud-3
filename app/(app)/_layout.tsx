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
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';

const api = 'cnvc46pm8uq9';
const client = StreamChat.getInstance(api);

export default function AppLayout() {
  const { id, getId, user } = useData();
  const userProfile = {
    id: user?.id as string,
    name: user?.name as string,
  };
  const token: string = user?.streamToken as string;

  const { data, refetch, isPaused, isPending, isError, isRefetching } =
    useProfile(id as string);
  console.log('🚀 ~ file: _layout.tsx:AppLayout ~ data:', data?.profile);

  useEffect(() => {
    if (!data?.profile) {
      return;
    }
    console.log('Use effect working');
    const { profile } = data;
    if (!profile) return;
    const connectUser = async () => {
      try {
        console.log('Connected to stream 1');

        await client.connectUser(
          {
            id: profile?.userId.toString() as string,
            name: profile?.name,
            image: profile?.avatar,
          },
          profile?.streamToken
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
  }, [client, data?.profile?.userId]);

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
    getId();
  }, []);

  useEffect(() => {
    getUserStored();
  }, []);
  if (isError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  if (!id) {
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
