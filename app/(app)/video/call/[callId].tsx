import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Call,
  CallContent,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { useToken } from '@/hooks/useToken';

type Props = {};

const CallScreen = (props: Props) => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const router = useRouter();
  const { workspaceId } = useToken();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  useEffect(() => {
    if (!client || call) return;
    const joinCall = async () => {
      const call = client.call('default', callId);
      await call.join({ create: true });
      setCall(call);
    };

    joinCall();
  }, [client]);

  if (!call) return <LoadingComponent />;
  const onHangUp = async () => {
    const { error } = await supabase
      .from('waitList')
      .delete()
      .eq('id', workspaceId);
    if (error) {
      console.log(error);
    }

    if (!error) {
      Toast.show({
        type: 'info',
        text1: 'Call ended',
      });
    }
    router.back();
  };
  return (
    <View style={{ flex: 1 }}>
      <StreamCall call={call}>
        <CallContent onHangupCallHandler={onHangUp} />
      </StreamCall>
    </View>
  );
};

export default CallScreen;
