import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderNav } from '../../../components/HeaderNav';
import { defaultStyle } from '../../../constants/index';
import { TopCard } from '../../../components/LoggedInuser/TopCard';
import { BottomCard } from '../../../components/LoggedInuser/BottomCard';
import { MiddleCard } from '../../../components/LoggedInuser/MiddleCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';

type Props = {};

const MyProfile = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const { data, refetch, isPaused, isPending, isError, isRefetching } =
    useProfile(id);

  if (isError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  const { user } = data;
  return (
    <View style={{ flex: 1 }}>
      <View style={defaultStyle}>
        <HeaderNav title="Profile" />
      </View>
      <TopCard
        id={user?.id}
        name={user?.name}
        image={user?.avatarUrl}
        ownedWks={user?.workspace}
      />
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
