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
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/constants/types';

type Props = {};

const MyProfile = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<Profile | null>();
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ MyProfile ~ user:', user);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoading(true);
    const getProfile = async () => {
      const { data, error } = await supabase
        .from('user')
        .select(
          `name, avatar, streamToken, email, userId , organizationId (*), workerId (*)`
        )
        .eq('userId', id)
        .single();

      return {
        profile: data,
        error,
      };
    };
    const getUser = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['profile', id],
        queryFn: getProfile,
      });
      // @ts-ignore
      setUser(data?.profile);
      setLoading(false);
    };

    getUser();
  }, []);
  console.log('🚀 ~ MyProfile ~ user:', user);

  const numberOfWorkspace = user?.workspace?.length || 0;

  console.log('🚀 ~ MyProfile ~', user);
  if (loading) {
    return <LoadingComponent />;
  }
  const assignedWk = user?.workerId?.workspaceId ? 1 : 0;
  return (
    <View style={{ flex: 1 }}>
      <View style={defaultStyle}>
        <HeaderNav title="Profile" />
      </View>
      <TopCard
        id={user?.userId}
        name={user?.name}
        image={user?.avatar}
        ownedWks={numberOfWorkspace}
        assignedWk={assignedWk}
        workspaceId={user?.workerId?.id}
      />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <MiddleCard />
      </View>
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <BottomCard workId={user?.workerId?.id} />
      </View>
    </View>
  );
};

export default MyProfile;
