import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from 'stream-chat-expo';
import { useLocalSearchParams } from 'expo-router';
import { Channel as ChannelType } from 'stream-chat';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';

type Props = {};

const SingleChat = (props: Props) => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { client } = useChatContext();
  const [channel, setChannel] = useState<ChannelType>();

  useEffect(() => {
    const fetchChannel = async () => {
      const channel = await client.queryChannels({ id: { $eq: chatId } });
      setChannel(channel[0]);
    };
    fetchChannel();
  }, [chatId]);
  if (!channel) return <LoadingComponent />;
  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
};

export default SingleChat;
