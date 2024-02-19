import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { TextComponents } from '../../components/TextComponents';
import { defaultStyle } from '../../constants/index';

type Props = {};
const messageArray = Array.from({ length: 10 }, (_, i) => i + 1);
const messages = (props: Props) => {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      {/* <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: darkMode ? 'white' : 'black',
        }}
      >
        No messages yet
      </Text> */}

      <FlatList
        data={messageArray}
        renderItem={({ item }) => <TextComponents />}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default messages;

const styles = StyleSheet.create({});
