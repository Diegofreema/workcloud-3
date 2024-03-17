import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../hooks/warmUpBrowser';
import { Button, Text } from 'react-native-paper';
import { Redirect, useRouter } from 'expo-router';
import { colors } from '../../constants/Colors';
import { AuthTitle } from '../../components/AuthTitle';
import { View } from 'react-native';
import { useDarkMode } from '../../hooks/useDarkMode';

import { Container } from '@/components/Ui/Container';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  const { darkMode } = useDarkMode();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { getUserData } = useData();

  console.log('🚀 ~ SignInWithOAuth ~ user:', user);
  useWarmUpBrowser();
  const router = useRouter();

  const createProfile = async () => {
    try {
      const { data } = await axios.post(
        'https://server-zeta-blush.vercel.app/create-profile',
        {
          email: user?.emailAddresses[0].emailAddress,
          name: user?.fullName,
          avatarUrl: user?.imageUrl,
          user_id: user?.id,
        }
      );
      getUserData(data);

      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (error) {
      console.log(error);
    }
  };

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        console.log('🚀 ~ onPress ~ createdSessionId:', createdSessionId);
        setActive!({ session: createdSessionId });
        createProfile();
        return router.replace('/home');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <Container>
      <View style={{ marginTop: 50 }}>
        <AuthTitle>Welcome, Login to continue</AuthTitle>
        <Text
          style={{
            marginTop: 20,

            color: darkMode ? 'white' : colors.textGray,
            fontFamily: 'PoppinsBold',
          }}
        >
          Login to continue accessing organizations
        </Text>
        <View style={{ marginTop: 30 }}>
          <Button
            mode="contained"
            onPress={onPress}
            buttonColor={colors.buttonBlue}
            textColor="white"
            contentStyle={{
              height: 50,
              borderRadius: 10,
              flexDirection: 'row-reverse',
            }}
            icon={'google'}
            uppercase
            rippleColor={'#000'}
            labelStyle={{
              fontFamily: 'PoppinsMedium',
            }}
          >
            Sign in with
          </Button>
        </View>
      </View>
    </Container>
  );
};
export default SignInWithOAuth;
