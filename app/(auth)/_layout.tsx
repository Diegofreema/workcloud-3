import { View, Text } from 'react-native';
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

type Props = {};

const AuthLayout = (props: Props) => {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) {
    return <Redirect href={'/home'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
