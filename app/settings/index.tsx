import { View, Text, Pressable } from 'react-native';
import React from 'react';

import { HStack } from '@gluestack-ui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { defaultStyle } from '../../constants/index';
import { HeaderNav } from '../../components/HeaderNav';
import { MyText } from '../../components/Ui/MyText';

const links = [
  {
    text: 'Set qualifications',
    href: '/settings/set-qualification',
  },
  {
    text: 'Change password',
    href: '/settings/change-password',
  },
];
const settings = () => {
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <HeaderNav title="Settings" />
      <View style={{ gap: 40, marginTop: 20 }}>
        {links.map((link, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(link.href as any)}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <MyText fontSize={14} poppins="Medium">
                {link.text}
              </MyText>
              <FontAwesome name="angle-right" size={24} />
            </HStack>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default settings;
