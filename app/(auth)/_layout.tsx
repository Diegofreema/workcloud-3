import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { AuthHeader } from '../../components/AuthHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const AuthLayout = (props: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 20,

        marginTop: -30,
      }}
    >
      <AuthHeader />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
