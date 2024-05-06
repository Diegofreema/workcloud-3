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
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { useChatClient } from '@/useChatClient';
import { AppProvider } from '@/AppContext';
import { chatApiKey } from '../../chatConfig';

const api = 'cnvc46pm8uq9';
const client = StreamChat.getInstance('cnvc46pm8uq9');

export default function AppLayout() {
  const { clientIsReady } = useChatClient();
  const { id, getValues, user } = useData();
  console.log('🚀 ~ AppLayout ~ user:', user?.streamToken);
  // const [clientVideo] = useState(() => {
  //   const userData = {
  //     id: user?.id as string,
  //     name: user?.name as string,
  //   };
  //   const tokenProvider = () => Promise.resolve(user?.streamToken as string);
  //   return new StreamVideoClient({
  //     chatApiKey,
  //     tokenProvider,
  //     userData,
  //   });
  // });
  const chatTheme: DeepPartial<Theme> = {
    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
      title: {
        fontFamily: 'PoppinsBold',
        fontSize: 13,
      },
      message: {
        fontFamily: 'PoppinsMedium',
        fontSize: 10,
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
  if (!clientIsReady) {
    return <LoadingComponent />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {/* <StreamVideo client={clientVideo}> */}
      <AppProvider>
        <OverlayProvider value={{ style: chatTheme }}>
          <Chat client={client}>
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="(tabs)"
            />
          </Chat>
        </OverlayProvider>
      </AppProvider>
      {/* </StreamVideo> */}
    </GestureHandlerRootView>
  );
}
