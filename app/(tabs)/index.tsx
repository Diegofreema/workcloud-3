import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { router, useFocusEffect, useRouter } from 'expo-router';
import { defaultStyle, fontFamily } from '../../constants';
import { Header } from '../../components/Header';
// import { useAuth } from '@clerk/clerk-expo';
import { ProfileHeader } from '../../components/ProfileHeader';
import { colors } from '../../constants/Colors';
import { useFollowers, usePersonalOrgs } from '../../lib/queries';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useContext, useCallback, useEffect, useLayoutEffect } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useOrganizationModal } from '../../hooks/useOrganizationModal';
import { OrganizationModal } from '../../components/OrganizationModal';
import { HeadingText } from '../../components/Ui/HeadingText';
import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { VStack } from '@gluestack-ui/themed';
import { MyText } from '../../components/Ui/MyText';

export default function TabOneScreen() {
  const router = useRouter();
  // const { isLoaded, userId } = useAuth();
  const { data: orgs } = usePersonalOrgs();

  // const loggedIn = isLoaded && !!userId;
  const { onOpen } = useOrganizationModal();

  // useFocusEffect(
  //   useCallback(() => {
  //     if (loggedIn && orgs?.orgs?.length === 0) {
  //       onOpen();
  //     }
  //   }, [])
  // );
  const { data, isLoading, isFetching, error, isPending } = useFollowers();
  const { darkMode } = useDarkMode();
  return (
    <Text>work</Text>
    // <View style={[defaultStyle, styles.container]}>
    //   <OrganizationModal />
    //   <Header />
    //   {loggedIn && <ProfileHeader id={userId} />}
    //   {loggedIn ? (
    //     <View style={{ marginVertical: 10 }}>
    //       <HeadingText link="/connections" />
    //     </View>
    //   ) : (
    //     <Text
    //       style={{
    //         color: darkMode ? 'white' : 'black',
    //         fontFamily: 'PoppinsBold',
    //         marginBottom: 10,
    //       }}
    //     >
    //       Login in to see your connections
    //     </Text>
    //   )}

    //   {isFetching || isLoading || isPending ? (
    //     <ActivityIndicator style={{ marginTop: 20 }} animating />
    //   ) : loggedIn ? (
    //     <FlatList
    //       contentContainerStyle={{
    //         gap: 15,

    //         paddingBottom: 50,
    //       }}
    //       data={[1, 2, 3]}
    //       keyExtractor={(item, index) => index.toString()}
    //       renderItem={({ item, index }) => {
    //         const lastIndex = [1, 2, 3].length - 1;
    //         const isLastItemOnList = index === lastIndex;
    //         return <Item isLastItemOnList={isLastItemOnList} />;
    //       }}
    //       showsVerticalScrollIndicator={false}
    //       ListEmptyComponent={() => {
    //         return (
    //           <Text
    //             variant="titleLarge"
    //             style={{
    //               fontFamily: fontFamily.Bold,
    //               marginTop: 30,
    //               color: darkMode ? 'white' : 'black',
    //             }}
    //           >
    //             {loggedIn ? 'No connections yet' : ''}
    //           </Text>
    //         );
    //       }}
    //     />
    //   ) : null}
    // </View>
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
