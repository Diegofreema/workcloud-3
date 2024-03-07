import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderNav } from '../../../components/HeaderNav';
import { defaultStyle } from '../../../constants/index';
import { TopCard } from '../../../components/LoggedInuser/TopCard';
import { BottomCard } from '../../../components/LoggedInuser/BottomCard';
import { MiddleCard } from '../../../components/LoggedInuser/MiddleCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Redirect } from 'expo-router';

type Props = {};

const MyProfile = (props: Props) => {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoaded]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={defaultStyle}>
        <HeaderNav title="Profile" />
      </View>
      <TopCard id={user?.id} name={user?.fullName} image={user?.imageUrl} />
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
