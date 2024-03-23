import { StyleSheet, Pressable } from 'react-native';
import { Organization } from '../constants/types';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
import { useRouter } from 'expo-router';

export const WorkspaceItem = ({ org }: Organization) => {
  console.log('🚀 ~ WorkspaceItem ~ org:', org);

  const { darkMode } = useDarkMode();
  const router = useRouter();
  return (
    <Pressable
      /* @ts-ignore */
      onPress={() => router.push(`/(organization)/${org._id}`)}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      <Image
        source={{ uri: org?.avatar }}
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
        {org?.organizationName}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
