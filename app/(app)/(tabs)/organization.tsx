import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { WorkCloudHeader } from '../../../components/WorkCloudHeader';
import {
  useOtherOrgs,
  usePersonalOrgs,
  useProfile,
} from '../../../lib/queries';
import { ActivityIndicator, Avatar, Text } from 'react-native-paper';
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
import { HStack, VStack } from '@gluestack-ui/themed';
import { WK } from '@/constants/types';

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

  const hasNoOrg = data === null;
  const { organizations } = data;
  const organization = organizations[0];
  console.log(otherOrgs.workspace, 'dsccsdcds');

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
        {!data.organizations.length ? (
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

            <WorkspaceItem
              item={organization}
              onPress={() =>
                router.push(`/(app)/(organization)/${organization?.id}`)
              }
            />
          </View>
        )}
      </View>

      <View style={{ marginTop: data === null ? 20 : 0 }}>
        <Text
          style={{
            fontFamily: 'PoppinsMedium',
            fontSize: 13,
            color: darkMode ? 'white' : 'black',
          }}
          variant="titleMedium"
        >
          Assigned workspace
        </Text>
        {otherOrgs?.workspace ? (
          <Workspace
            onPress={() => router.replace(`/wk/${otherOrgs?.workspace?.id}`)}
            item={otherOrgs?.workspace}
          />
        ) : (
          <EmptyText text="No assigned workspace yet" />
        )}
      </View>
    </View>
  );
};

export default workspace;

const styles = StyleSheet.create({});

const Workspace = ({ item, onPress }: { item: WK; onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={{ width: '100%' }}>
      <HStack gap={10} alignItems="center">
        <Avatar.Image
          source={{ uri: item?.organizationId?.avatar }}
          size={50}
        />
        <VStack>
          <Text variant="titleMedium">{item?.role}</Text>
          <View
            style={{
              backgroundColor: item?.active
                ? colors.openTextColor
                : colors.closeBackgroundColor,
              paddingHorizontal: 7,
              borderRadius: 3,
            }}
          >
            <Text
              variant="labelSmall"
              style={{
                color: item?.active
                  ? colors.openBackgroundColor
                  : colors.closeTextColor,
              }}
            >
              {item?.active}
            </Text>
          </View>
        </VStack>
      </HStack>
    </Pressable>
  );
};
