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

export const Item = (item: ConnectionType & { isLastItemOnList: boolean }) => {
  const router = useRouter();
  const startChannel = async () => {
    router.push(`/reception/${item?.connectedTo?.organizationId?.id}`);
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
            source={{ uri: item?.connectedTo?.organizationId?.avatar }}
            style={{ width: 48, height: 48, borderRadius: 9999 }}
          />
          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              {item?.connectedTo?.organizationId?.name}
            </MyText>
            {/* <View
              style={{
                backgroundColor: item?.connectedTo
                  ? colors.openTextColor
                  : colors.closeBackgroundColor,
                borderRadius: 9999,
                paddingHorizontal: 5,
                alignItems: 'center',
              }}
            >
           
            </View> */}
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Today
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            {formatDistanceToNow(new Date(item?.created_at))}
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
