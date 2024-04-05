import { View, Text } from 'react-native';
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useData } from '@/hooks/useData';
import { StatusBar } from 'expo-status-bar';

type Props = {};

const AuthLayout = (props: Props) => {
  const { user } = useData();

  if (user?.id) {
    return <Redirect href={'/home'} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
