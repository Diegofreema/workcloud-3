import { EvilIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {};

export const Header = ({}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: 'PoppinsBoldItalic',
          color: colors.buttonBlue,
          fontSize: 15,
        }}
      >
        Workcloud
      </Text>
      <View style={styles.subContainer}>
        <EvilIcons name="search" size={28} color={darkMode ? '#fff' : '#000'} />

        <EvilIcons name="bell" size={28} color={darkMode ? '#fff' : '#000'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});
