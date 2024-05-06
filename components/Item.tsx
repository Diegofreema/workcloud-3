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
import { ConnectionType } from '../constants/types';
import { checkLength } from '@/lib/helper';

export const Item = (item: ConnectionType & { isLastItemOnList?: boolean }) => {
  const router = useRouter();
  console.log(item?.connectedTo);

  const startChannel = async () => {
    router.push(`/reception/${item?.connectedTo?.id}`);
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
        <HStack gap={7} alignItems="center">
          <Image
            source={{ uri: item?.connectedTo?.avatar }}
            style={{ width: 48, height: 48, borderRadius: 9999 }}
          />
          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              {item?.connectedTo?.name}
            </MyText>
            <MyText poppins="Medium" fontSize={10}>
              {checkLength(item?.connectedTo?.description)}
            </MyText>
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Time
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            {formatDistanceToNow(new Date(item?.created_at))} ago
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
