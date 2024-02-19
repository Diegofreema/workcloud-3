import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { WorkCloudHeader } from '../../components/WorkCloudHeader';
import { usePersonalOrgs, useProfile } from '../../lib/queries';
import { ActivityIndicator, Text } from 'react-native-paper';
import { defaultStyle } from '../../constants';
import { WorkspaceItem } from '../../components/WorkspaceItem';
import { EmptyText } from '../../components/EmptyText';
import { ErrorComponent } from '../../components/Ui/ErrorComponent';
import { LoadingComponent } from '../../components/Ui/LoadingComponent';

type Props = {};

const workspace = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { data, isFetching, isLoading, isPending, refetch, error } =
    usePersonalOrgs();
  const haveOrganization = data?.orgs?.length === 0;
  console.log(haveOrganization);
  console.log(data?.orgs.length);

  if (isLoading || isPending || isFetching) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent refetch={refetch} />;
  }

  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <View style={{ marginVertical: 14 }}>
        {haveOrganization ? (
          <WorkCloudHeader />
        ) : (
          <WorkspaceItem item={data?.orgs[0]} />
        )}
      </View>

      <View style={{ marginTop: haveOrganization ? 20 : 0 }}>
        <FlatList
          ListHeaderComponent={() => (
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 14,
                color: darkMode ? 'white' : 'black',
              }}
              variant="titleMedium"
            >
              Your Workspace
            </Text>
          )}
          stickyHeaderHiddenOnScroll
          contentContainerStyle={{
            paddingVertical: 20,
            gap: 10,
            paddingTop: haveOrganization ? 20 : 0,
          }}
          data={data?.orgs}
          renderItem={({ item }) => (
            <Text
              style={{
                color: darkMode ? 'white' : 'black',
                fontFamily: 'PoppinsMedium',
                fontSize: 14,
              }}
            >
              No workspace yet
            </Text>
          )}
          keyExtractor={(item) => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={isPending}
          onRefresh={refetch}
          ListEmptyComponent={() => (
            <EmptyText text="You have no organizations yet" />
          )}
        />
      </View>

      {/* <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: darkMode ? 'white' : 'black',
          }}
          variant="titleMedium"
        >
          Assigned organizations
        </Text>
      </View> */}
    </View>
  );
};

export default workspace;

const styles = StyleSheet.create({});
