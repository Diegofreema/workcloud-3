import { Image } from 'expo-image';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/Colors';

type Props = {
  uri: string;
  name: string;
  darkMode: boolean;
};

export const WorkspaceDetails = ({
  uri,
  name,
  darkMode,
}: Props): JSX.Element => {
  return (
    <View style={{ alignItems: 'center', gap: 5, minWidth: 70 }}>
      <Image source={uri} style={styles.image} />
      <Text
        style={{
          color: darkMode ? colors.white : colors.black,
          fontFamily: 'PoppinsBold',
          fontSize: 8,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
