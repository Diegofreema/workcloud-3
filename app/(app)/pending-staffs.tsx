import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { usePendingWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { MyText } from '@/components/Ui/MyText';

type Props = {};

const PendingStaffs = (props: Props) => {
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = usePendingWorkers();
  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  console.log(data);

  return (
    <Container>
      <HeaderNav title="Pending Staffs" />
      <FlatList
        style={{ marginTop: 10 }}
        ListEmptyComponent={() => (
          <MyText
            poppins="Bold"
            fontSize={20}
            style={{ verticalAlign: 'middle', marginTop: 20 }}
          >
            No pending staffs
          </MyText>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={data?.requests}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item?.workers?.imageUrl}
            name={item?.workers?.name}
            navigate
            subText={item?.status}
          />
        )}
        keyExtractor={(item) => item?.workers?.id.toString()}
      />
    </Container>
  );
};

export default PendingStaffs;

const styles = StyleSheet.create({});
