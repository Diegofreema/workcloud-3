import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { WorkCloudHeader } from '../../../components/WorkCloudHeader';
import {
  useOtherOrgs,
  usePersonalOrgs,
  useProfile,
} from '../../../lib/queries';
import { ActivityIndicator, Text } from 'react-native-paper';
import { defaultStyle } from '../../../constants';
import { WorkspaceItem } from '../../../components/WorkspaceItem';
import { EmptyText } from '../../../components/EmptyText';
import { ErrorComponent } from '../../../components/Ui/ErrorComponent';
import { LoadingComponent } from '../../../components/Ui/LoadingComponent';
import { useData } from '@/hooks/useData';
import { HeaderNav } from '@/components/HeaderNav';
import { AuthTitle } from '@/components/AuthTitle';
import { colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type Props = {};

const workspace = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { id } = useData();
  const { data, isPending, refetch, isError, isPaused, error } =
    usePersonalOrgs(id);

  const {
    data: otherOrgs,
    isPending: isPendingOther,
    refetch: refetchOther,
    isError: isErrorOther,
    isPaused: isPausedOther,
    isRefetching,
    error: errorOther,
  } = useOtherOrgs(id);
  console.log('🚀 ~ workspace ~ otherOrgs:', otherOrgs, 'error', errorOther);
  const handleRefetch = () => {
    refetch();
    refetchOther();
  };
  if (error) {
    console.log(error.name, error.message);
  }
  if (isError || isPaused || isPausedOther || isErrorOther) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingOther) {
    return <LoadingComponent />;
  }
  console.log('🚀 ~ workspace ~ otherOrgs:', otherOrgs);
  console.log('🚀 ~ workspace ~ data:', data);

  const hasNoOrg = data === null;

  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
        <Text
          variant="titleLarge"
          style={{
            fontFamily: 'PoppinsBold',
            fontSize: 20,
            color: darkMode ? colors.white : colors.black,
          }}
        >
          {' '}
          Organizations
        </Text>
        <Pressable
          onPress={() => router.push('/search')}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <FontAwesome
            name="search"
            size={20}
            color={darkMode ? colors.white : colors.black}
          />
        </Pressable>
      </View>
      <View style={{ marginVertical: 14 }}>
        {data === null ? (
          <WorkCloudHeader />
        ) : (
          <View style={{ gap: 15 }}>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                color: darkMode ? 'white' : 'black',
                fontSize: 13,
              }}
              variant="titleMedium"
            >
              Your organization
            </Text>
            {/* @ts-ignore */}
            <WorkspaceItem org={data} />
          </View>
        )}
      </View>

      <View style={{ marginTop: data === null ? 20 : 0 }}>
        <FlatList
          ListHeaderComponent={() => (
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: 13,
                color: darkMode ? 'white' : 'black',
              }}
              variant="titleMedium"
            >
              Other Organizations
            </Text>
          )}
          contentContainerStyle={{
            paddingVertical: 20,
            gap: 10,
            paddingTop: hasNoOrg ? 20 : 0,
          }}
          data={otherOrgs}
          // @ts-ignore
          renderItem={({ item }) => <WorkspaceItem org={item} />}
          keyExtractor={(item) => item?._id?.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refetchOther}
          ListEmptyComponent={() => <EmptyText text="No organizations yet" />}
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
