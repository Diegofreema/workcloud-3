import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { router, useFocusEffect, useRouter } from 'expo-router';
import { defaultStyle, fontFamily } from '../../../constants';
import { Header } from '../../../components/Header';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { ProfileHeader } from '../../../components/ProfileHeader';
import { colors } from '../../../constants/Colors';
import {
  useFollowers,
  useGetConnection,
  useGetWorkerProfile,
  usePersonalOrgs,
  useProfile,
  useWorkers,
} from '../../../lib/queries';
import { Text } from 'react-native-paper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useOrganizationModal } from '../../../hooks/useOrganizationModal';
import { OrganizationModal } from '../../../components/OrganizationModal';
import { HeadingText } from '../../../components/Ui/HeadingText';
import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { VStack } from '@gluestack-ui/themed';
import { MyText } from '../../../components/Ui/MyText';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateProfile } from '@/lib/mutations';
import { useData } from '@/hooks/useData';
import { ConnectionType, Profile } from '../../../constants/types';
import { format, formatDistanceToNow } from 'date-fns';
import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';
import { supabase } from '@/lib/supabase';

export default function TabOneScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { id } = useData();
  // console.log('🚀 ~ TabOneScreen ~ id:', id);
  const queryClient = useQueryClient();
  const has = profile?.organizationId?.id && profile?.workerId?.id;

  useEffect(() => {
    const getFn = async () => {
      try {
        const getProfile = async () => {
          const { data, error } = await supabase
            .from('user')
            .select(
              `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
            )
            .eq('userId', id)
            .single();
          // @ts-ignore
          setProfile(data);
          return data;
        };
        const res = await queryClient.fetchQuery({
          queryKey: ['profile', id],
          queryFn: getProfile,
        });

        return res;
      } catch (error) {
        console.log(error);
        return {};
      }
    };
    getFn();
  }, [id]);
  useEffect(() => {
    if (!profile) return;
    if (!profile?.organizationId?.id && !profile?.workerId?.id) {
      onOpen();
    }
  }, [profile]);
  const {
    data: connections,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,
    error,
    isPaused: isConnectionsPaused,
  } = useGetConnection(id);

  const { onOpen } = useOrganizationModal();
  const handleRefetch = () => {
    refetchConnections();
  };
  console.log(profile?.organizationId?.id, profile?.workerId?.id);

  if (isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPendingConnections) {
    return <LoadingComponent />;
  }

  const { connections: connectionsData } = connections;
  if (!profile) {
    return <LoadingComponent />;
  }
  console.log('🚀 ~ TabOneScreen ~ has:', has);

  return (
    <View style={[defaultStyle, styles.container]}>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={profile?.userId}
        avatar={profile?.avatar}
        name={profile?.name}
        email={profile?.email}
      />

      <View style={{ marginVertical: 10 }}>
        <HeadingText link="/connections" />
      </View>

      <FlatList
        onRefresh={handleRefetch}
        refreshing={isRefetchingConnections}
        contentContainerStyle={{
          gap: 15,
          paddingBottom: 50,
        }}
        data={connectionsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;
          return <Item {...item} isLastItemOnList={isLastItemOnList} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyText text="No Connections yet" />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 20,
    borderColor: colors.gray,
  },
});
