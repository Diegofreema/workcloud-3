import { StyleSheet, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { defaultStyle } from '../../constants/index';

type Props = {};

export const LoadingComponent = ({}: Props): JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        ...defaultStyle,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({});
