import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { TextComponents } from '../../../components/TextComponents';
import { defaultStyle } from '../../../constants/index';
import { ChannelList } from 'stream-chat-expo';
import { MyText } from '@/components/Ui/MyText';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';

type Props = {};
const messageArray = Array.from({ length: 10 }, (_, i) => i + 1);
const messages = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { userId } = useAuth();
  const router = useRouter();
  const onSelect = (id: any) => {
    router.push(`/chat/${id}`);
  };
  if (!userId) return <LoadingComponent />;
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <ChannelList
        filters={{ members: { $in: [userId] } }}
        onSelect={(channel) => onSelect(channel.id)}
        EmptyStateIndicator={EmptyComponent}
      />
    </View>
  );
};

export default messages;

const styles = StyleSheet.create({});

const EmptyComponent = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyText poppins="Bold" fontSize={20}>
        No messages yet
      </MyText>
    </View>
  );
};
