import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { MyText } from './Ui/MyText';
import { colors } from '@/constants/Colors';
import { formatDistanceToNow } from 'date-fns';
import { VStack } from '@gluestack-ui/themed';
import { useData } from '@/hooks/useData';
import { useChatContext } from 'stream-chat-expo';
import { useRouter } from 'expo-router';

type ItemType = {
  _id: string;
  userId: string;
  organizationsId: string;
  organization: {
    organizationName: string;
    open: boolean;
    avatar: { url: string };
    _id: string;
  };
  createdAt: string;
};
export const Item = (item: ItemType & { isLastItemOnList: boolean }) => {
  const { user } = useData();
  const { client } = useChatContext();
  const router = useRouter();
  const startChannel = async () => {
    const channel = client.channel('messaging', {
      members: [user?.id as string, item.userId],
    });

    await channel.watch();

    router.push(`/chat/${channel.id}`);
  };
  return (
    <Pressable
      //@ts-ignore
      onPress={startChannel}
      style={({ pressed }) => [
        styles.item,
        { borderBottomWidth: item.isLastItemOnList ? 0 : 1 },
        pressed && { opacity: 0.3 },
      ]}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={7}>
          <Image
            source={{ uri: item?.organization?.avatar?.url }}
            style={{ width: 48, height: 48, borderRadius: 9999 }}
          />
          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              {item?.organization?.organizationName}
            </MyText>
            <View
              style={{
                backgroundColor: item?.organization?.open
                  ? colors.openTextColor
                  : colors.closeBackgroundColor,
                borderRadius: 9999,
                paddingHorizontal: 5,
                alignItems: 'center',
              }}
            >
              <MyText
                style={{
                  color: item?.organization?.open
                    ? colors.openBackgroundColor
                    : colors.closeTextColor,
                }}
                poppins="Bold"
                fontSize={9}
              >
                {item?.organization?.open ? 'Open' : 'Closed'}
              </MyText>
            </View>
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Today
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            {formatDistanceToNow(new Date(item.createdAt))}
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 20,
    borderColor: colors.gray,
  },
});
