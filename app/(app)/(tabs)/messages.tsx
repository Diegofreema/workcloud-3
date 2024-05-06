import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { ComponentType } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { TextComponents } from '../../../components/TextComponents';
import { defaultStyle } from '../../../constants/index';
import {
  ChannelAvatar,
  ChannelList,
  ChannelPreview,
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
  EmptyStateProps,
} from 'stream-chat-expo';
import { MyText } from '@/components/Ui/MyText';
import { useAuth } from '@clerk/clerk-expo';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';

type Props = {};

const messages = (props: Props) => {
  const { id: userId } = useData();
  const router = useRouter();
  const onSelect = (id: any) => {
    router.push(`/chat/${id}`);
  };

  console.log(userId);

  return (
    <View style={{ flex: 1, ...defaultStyle, backgroundColor: 'white' }}>
      <ChannelList
        filters={{ members: { $in: [userId] } }}
        onSelect={(channel) => onSelect(channel.id)}
        EmptyStateIndicator={EmptyComponent}
        HeaderErrorIndicator={ErrorComponent}
        Preview={Preview}
        numberOfSkeletons={20}
      />
    </View>
  );
};

export default messages;

const styles = StyleSheet.create({});

const EmptyComponent = ({ listType }: EmptyStateProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyText poppins="Bold" fontSize={20}>
        No messages yet
      </MyText>
    </View>
  );
};
const ErrorComponent = () => {
  return (
    <View>
      <MyText poppins="Bold" fontSize={15}>
        There was an error loading this chat
      </MyText>
    </View>
  );
};

const Preview = (props: ChannelPreviewMessengerProps) => {
  const { unread, PreviewAvatar, latestMessagePreview } = props;

  const backgroundColor = unread ? colors.gray : 'transparent';
  return (
    <View style={{ backgroundColor: backgroundColor }}>
      <ChannelPreview
        {...props}
        Preview={(items) => (
          <ChannelPreviewMessenger
            {...items}
            PreviewTitle={items?.PreviewTitle}
          />
        )}
      />
    </View>
  );
};
