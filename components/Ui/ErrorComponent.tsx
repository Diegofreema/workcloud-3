import { StyleSheet, View, Text } from 'react-native';
import { defaultStyle } from '../../constants/index';
import { useDarkMode } from '../../hooks/useDarkMode';
import { MyButton } from './MyButton';
import { useState } from 'react';

type Props = {
  refetch: any;
};

export const ErrorComponent = ({ refetch }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  const [error, setError] = useState(false);
  const handleRefetch = () => {
    setError((prev) => !prev);
    refetch();
  };
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
          verticalAlign: 'middle',
        }}
      >
        Something went wrong, please try again
      </Text>
      <MyButton onPress={handleRefetch}>Retry</MyButton>
    </View>
  );
};

const styles = StyleSheet.create({});
