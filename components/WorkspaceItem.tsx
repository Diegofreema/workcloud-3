import { StyleSheet, Pressable } from 'react-native';
import { Organization } from '../constants/types';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
import { useRouter } from 'expo-router';

export const WorkspaceItem = ({
  avatar,
  name,
  ownerId,
}: {
  avatar: string;
  name: string;
  ownerId?: string;
}) => {
  console.log('🚀 ~ WorkspaceItem ~ avatar, name:', avatar, name, ownerId);
  const { darkMode } = useDarkMode();
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        /* @ts-ignore */
        router.push(`/(organization)/${ownerId}`)
      }
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'black',
        }}
        contentFit="cover"
      />
      <Text
        style={{
          fontFamily: 'PoppinsMedium',
          fontSize: 12,
          color: darkMode ? 'white' : 'black',
          textTransform: 'capitalize',
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
