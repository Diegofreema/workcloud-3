import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { CallComponent } from '../../components/CallComponent';
import { defaultStyle } from '../../constants/index';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/Colors';

type Props = {};

// create an empty array from 1 to 10
const callArray = Array.from({ length: 10 }, (_, i) => i + 1);

const call = (props: Props) => {
  const { darkMode } = useDarkMode();
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      {/* <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: darkMode ? 'white' : 'black',
        }}
      >
        No calls yet
      </Text> */}

      <FlatList
        data={callArray}
        renderItem={({ item }) => <CallComponent />}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: colors.dialPad,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="keypad-outline" size={24} color="white" />
      </View>
    </View>
  );
};

export default call;

const styles = StyleSheet.create({});
