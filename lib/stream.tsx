import { StyleSheet, View, Text } from 'react-native';
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { PropsWithChildren, useEffect } from 'react';
import { useData } from '@/hooks/useData';
type Props = {};
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

const client = new StreamVideoClient({ apiKey });
export const StreamClientProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const { user } = useData();
  useEffect(() => {
    if (!user) return;
    const onConnectUser = async () => {
      await client.connectUser(
        {
          id: user.id,
          name: user.name,
          image: user.avatar,
        },
        user?.streamToken
      );
    };

    onConnectUser();

    return () => {
      client.disconnectUser();
    };
  }, [user, client]);
  return <StreamVideo client={client}>{children}</StreamVideo>;
};

const styles = StyleSheet.create({});
