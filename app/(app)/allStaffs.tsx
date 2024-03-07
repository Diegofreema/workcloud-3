import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { AuthHeader } from '@/components/AuthHeader';
import { HeaderNav } from '@/components/HeaderNav';
import { Button } from 'react-native-paper';
import { EvilIcons } from '@expo/vector-icons';
import { useGetOtherWorkers, usePendingWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Workers } from '@/constants/types';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { MyText } from '@/components/Ui/MyText';
import { useRouter } from 'expo-router';
import { UserPreview } from '@/components/Ui/UserPreview';

type Props = {};

const AllStaffs = (props: Props) => {
  const { id, role } = useDetailsToAdd();
  const [staffs, setStaffs] = useState<Workers[] | undefined>([]);
  console.log('🚀 ~ AllStaffs ~ id:', id, 'role', role);
  const {
    data,
    isPending,
    isError,
    isPaused,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetOtherWorkers();
  const {
    data: pendingData,
    isPending: isPendingData,
    isError: isErrorData,
    isPaused: isPausedData,
    refetch: refetchData,
    isRefetching: isRefetchingData,
    isRefetchError: isRefetchErrorData,
  } = usePendingWorkers();
  useEffect(() => {
    if (data?.worker) {
      setStaffs(data?.worker);
    }
  }, [data?.worker]);

  const handleRefetch = () => {
    refetchData();
    refetch();
  };
  if (
    isPaused ||
    isError ||
    isPausedData ||
    isErrorData ||
    isRefetchError ||
    isRefetchErrorData
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPending || isPendingData) {
    return <LoadingComponent />;
  }

  const onRefreshing = isRefetching || isRefetchingData;

  return (
    <View style={styles.container}>
      <HeaderNav title="Add staff" RightComponent={RightComponent} />
      <FlatList
        onRefresh={handleRefetch}
        refreshing={onRefreshing}
        data={staffs}
        renderItem={({ item }) => (
          <UserPreview
            id={item?.id}
            imageUrl={item?.imageUrl}
            name={item?.name}
            subText={item?.location}
            navigate
          />
        )}
        style={{ marginTop: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyExtractor={(item) => item?.id.toString()}
        ListEmptyComponent={() => (
          <MyText
            poppins="Bold"
            fontSize={20}
            style={{ marginBottom: 20, verticalAlign: 'middle' }}
          >
            No staffs found
          </MyText>
        )}
      />
    </View>
  );
};

export default AllStaffs;

const RightComponent = () => {
  return (
    <Button
      onPress={() => alert('search pressed')}
      style={{ marginRight: -15 }}
      rippleColor={'rgba(0, 0, 0, .32)'}
    >
      <EvilIcons name="search" size={24} color="black" />
    </Button>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
