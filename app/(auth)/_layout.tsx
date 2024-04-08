import { View, Text } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useData } from '@/hooks/useData';
import { StatusBar } from 'expo-status-bar';

type Props = {};

const AuthLayout = (props: Props) => {
  const { getValues, id, user } = useData();

  const getUserStored = useCallback(() => {
    getValues();
  }, []);
  useEffect(() => {
    getUserStored();
  }, []);

  if (id && user?.id) {
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
