import { StyleSheet, Pressable } from 'react-native';
import { Organization } from '../constants/types';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
import { useRouter } from 'expo-router';

export const WorkspaceItem = ({
  item,
  onPress,
}: {
  item: Organization;
  onPress?: () => void;
}) => {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      <Image
        source={{ uri: item?.avatar }}
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
        {item?.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
