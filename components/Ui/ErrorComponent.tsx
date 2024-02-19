import { StyleSheet, View, Text } from 'react-native';
import { defaultStyle } from '../../constants/index';
import { useDarkMode } from '../../hooks/useDarkMode';
import { MyButton } from './MyButton';

type Props = {
  refetch: any;
};

export const ErrorComponent = ({ refetch }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <View
      style={{
        flex: 1,
        ...defaultStyle,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Text
        style={{
          color: darkMode ? 'white' : 'black',
          fontFamily: 'PoppinsBold',
          fontSize: 20,
        }}
      >
        Something went wrong, please try again
      </Text>
      <MyButton onPress={refetch}>Retry</MyButton>
    </View>
  );
};

const styles = StyleSheet.create({});
