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
import { useCallback, useEffect } from 'react';
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
import { ConnectionType } from '../../../constants/types';
import { format, formatDistanceToNow } from 'date-fns';
import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';

export default function TabOneScreen() {
  const router = useRouter();
  const { user: profile, id } = useData();
  // console.log('🚀 ~ TabOneScreen ~ id:', id);

  const { data, refetch, isPaused, isPending, isError, isRefetching } =
    useProfile(profile?.id as string);

  const {
    data: connections,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,
    error,
    isPaused: isConnectionsPaused,
  } = useGetConnection(profile?.id);

  const { onOpen } = useOrganizationModal();
  const handleRefetch = () => {
    refetch();
    refetchConnections();
    // refetchWorkerProfile();
    // refetchOrgs();
  };
  console.log(data?.profile?.workerId?.id, data?.profile?.organizationId?.id);

  useEffect(() => {
    if (!data?.profile?.organizationId?.id && !data?.profile?.workerId?.id) {
      onOpen();
    }
  }, [data]);

  if (
    isError ||
    isPaused ||
    isErrorConnections ||
    isConnectionsPaused
    // isErrorWorker ||
    // isOrgsError ||
    // workerProfile?.error ||
    // isPausedProfile ||
    // isOrgsPaused
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (
    isPending ||
    isPendingConnections
    // isPendingWorkerProfile ||
    // isOrgsPending
  ) {
    return <LoadingComponent />;
  }

  const { profile: user } = data;
  const { allConnections } = connections;

  return (
    <View style={[defaultStyle, styles.container]}>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={user?.userId}
        avatar={user?.avatar}
        name={user?.name}
        email={user?.email}
      />

      <View style={{ marginVertical: 10 }}>
        <HeadingText link="/connections" />
      </View>

      <FlatList
        onRefresh={handleRefetch}
        refreshing={isRefetching}
        contentContainerStyle={{
          gap: 15,

          paddingBottom: 50,
        }}
        data={allConnections}
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
