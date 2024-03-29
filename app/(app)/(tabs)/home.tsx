import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { router, useFocusEffect, useRouter } from 'expo-router';
import { defaultStyle, fontFamily } from '../../../constants';
import { Header } from '../../../components/Header';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { ProfileHeader } from '../../../components/ProfileHeader';
import { colors } from '../../../constants/Colors';
import {
  useFollowers,
  usePersonalOrgs,
  useProfile,
  useWorkers,
} from '../../../lib/queries';
import { Text } from 'react-native-paper';
import { useCallback } from 'react';
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

export default function TabOneScreen() {
  const router = useRouter();
  const { user: profile, id } = useData();
  console.log('🚀 ~ TabOneScreen ~ id:', id);

  const queryClient = useQueryClient();
  const { data, refetch, isPaused, isPending, isError, isRefetching } =
    useProfile(profile?.id as string);
  const { onOpen } = useOrganizationModal();
  if (isError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     if (
  //       isSignedIn &&
  //       orgs?.orgs?.length === 0 &&
  //       isSignedIn &&
  //       isNotAWorker
  //     ) {
  //       onOpen();
  //     }
  //   }, [])
  // );

  const { user } = data;

  return (
    <View style={[defaultStyle, styles.container]}>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={user.id}
        avatar={user.avatarUrl}
        name={user.name}
        email={user.email}
      />

      <View style={{ marginVertical: 10 }}>
        <HeadingText link="/connections" />
      </View>

      <FlatList
        onRefresh={refetch}
        refreshing={isRefetching}
        contentContainerStyle={{
          gap: 15,

          paddingBottom: 50,
        }}
        data={[1, 2, 3]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;
          return <Item isLastItemOnList={isLastItemOnList} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return (
            <Text
              variant="titleLarge"
              style={{
                fontFamily: fontFamily.Bold,
                marginTop: 30,
                color: 'black',
              }}
            >
              {'No connections yet'}
            </Text>
          );
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

const Item = ({ isLastItemOnList }: { isLastItemOnList: boolean }) => {
  return (
    <Pressable
      onPress={() => router.push(`/overview/${2}`)}
      style={({ pressed }) => [
        styles.item,
        { borderBottomWidth: isLastItemOnList ? 0 : 1 },
        pressed && { opacity: 0.3 },
      ]}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={7}>
          <Image
            source={{ uri: 'https://via.placeholder.com/48x48' }}
            style={{ width: 48, height: 48, borderRadius: 9999 }}
          />
          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              Fiedlity
            </MyText>
            <View
              style={{
                backgroundColor: colors.gray,
                borderRadius: 9999,
                paddingHorizontal: 5,
                alignItems: 'center',
              }}
            >
              <MyText poppins="Bold" fontSize={9}>
                open
              </MyText>
            </View>
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Today
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            2:00 PM
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};
