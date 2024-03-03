import { View } from 'react-native';
import React from 'react';
import { HeaderNav } from '../../components/HeaderNav';
import { defaultStyle } from '../../constants/index';
import { TopCard } from '../../components/LoggedInuser/TopCard';
import { BottomCard } from '../../components/LoggedInuser/BottomCard';
import { MiddleCard } from '../../components/LoggedInuser/MiddleCard';

type Props = {};

const MyProfile = (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={defaultStyle}>
        <HeaderNav title="Profile" />
      </View>
      <TopCard />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <MiddleCard />
      </View>
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <BottomCard />
      </View>
    </View>
  );
};

export default MyProfile;
