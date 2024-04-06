import { View, Text } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useData } from '@/hooks/useData';
import { StatusBar } from 'expo-status-bar';

type Props = {};

const AuthLayout = (props: Props) => {
  const { getId, id, user } = useData();
  console.log('🚀 ~ file: _layout.tsx:AuthLayout ~ user:', user, 'id', id);

  const getUserStored = useCallback(() => {
    getId();
  }, []);
  useEffect(() => {
    getUserStored();
  }, []);

  if (id) {
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
