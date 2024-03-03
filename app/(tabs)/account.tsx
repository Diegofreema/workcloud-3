import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Switch, Text } from 'react-native-paper';
import { defaultStyle } from '../../constants';
import { useAuth } from '@clerk/clerk-expo';
import { colors } from '../../constants/Colors';

import { useDarkMode } from '../../hooks/useDarkMode';

type Props = {};
const { width } = Dimensions.get('window');
const account = (props: Props) => {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const { signOut, isSignedIn } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          ...defaultStyle,
          paddingTop: 50,
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        {!isSignedIn && (
          <Button
            buttonColor={colors.buttonBlue}
            onPress={() => router.push('/login')}
            mode="contained-tonal"
            style={{ width: width * 0.4 }}
            textColor="white"
            labelStyle={{ color: 'white', fontFamily: 'PoppinsMedium' }}
          >
            Sign in
          </Button>
        )}

        {isSignedIn && (
          <Button
            style={{ width: width * 0.4 }}
            onPress={() => signOut()}
            mode="contained-tonal"
            labelStyle={{ color: 'white', fontFamily: 'PoppinsMedium' }}
          >
            Sign out
          </Button>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Text
          style={{ fontWeight: 'bold', color: darkMode ? 'white' : 'black' }}
        >
          Theme
        </Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
};

export default account;

const styles = StyleSheet.create({});
