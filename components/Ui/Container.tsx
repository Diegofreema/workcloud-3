import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useDarkMode } from '../../hooks/useDarkMode';

type Props = {
  children: React.ReactNode;
  flex?: number;
};

export const Container = ({ children, flex }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <View
      style={{
        flex: flex,
        paddingHorizontal: 20,
        backgroundColor: darkMode ? 'black' : 'white',
      }}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({});
