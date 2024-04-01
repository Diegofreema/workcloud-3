import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { usePendingRequest } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { EmptyText } from '@/components/EmptyText';
import { UserPreview, WorkPreview } from '@/components/Ui/UserPreview';

type Props = {};

const Requests = (props: Props) => {
  const { user, id } = useData();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = usePendingRequest(id);
  console.log('🚀 ~ Requests ~ data:', data?.requestsList[0]?._id);
  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  // 6602c083d9c51008cb52b02c
  return (
    <Container>
      <HeaderNav title="Pending Requests" />
      <FlatList
        style={{ marginTop: 10 }}
        ListEmptyComponent={() => <EmptyText text="No pending request" />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={data?.requestsList}
        renderItem={({ item }) => (
          <WorkPreview
            imageUrl={item?.from?.organizations?.avatar.url}
            name={item?.from?.organizations.organizationName}
            subText={item?.status}
            id={item?._id}
            navigate
          />
        )}
        keyExtractor={(item) => item?._id.toString()}
      />
    </Container>
  );
};

export default Requests;
