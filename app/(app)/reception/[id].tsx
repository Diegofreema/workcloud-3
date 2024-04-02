import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetOrg, useOrgsWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { HeaderNav } from '@/components/HeaderNav';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Avatar } from 'react-native-paper';
import signup from '../board';
import { MyText } from '@/components/Ui/MyText';
import { colors } from '@/constants/Colors';
import { WorkerWithWorkspace } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import { useData } from '@/hooks/useData';
import Toast from 'react-native-toast-message';

type Props = {};

const Reception = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, error, refetch, isPaused } = useGetOrg(id);
  const {
    data: workers,
    isPending: isPendingWorkers,
    error: errorWorkers,
    refetch: refetchWorkers,
    isPaused: isPausedWorkers,
  } = useOrgsWorkers(data?.org?.id);

  const handleRefetch = () => {
    refetch();
    refetchWorkers();
  };
  if (error || isPausedWorkers || isPaused || errorWorkers) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingWorkers) {
    return <LoadingComponent />;
  }

  const { org } = data;
  const { workers: staffs } = workers;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      style={{ flex: 1, marginHorizontal: 20 }}
    >
      <HeaderNav title={org?.name} subTitle={org?.subTitle} />
      <HStack gap={10} alignItems="center" mt={10}>
        <Avatar.Image source={{ uri: org?.avatar }} size={50} />
        <VStack>
          <MyText poppins="Medium" style={{ color: colors.nine }}>
            Opening hours:
          </MyText>

          <HStack gap={20} mb={10} alignItems="center">
            <MyText poppins="Medium">Monday - Friday</MyText>
            <HStack alignItems="center">
              <View style={styles.subCon}>
                <MyText
                  poppins="Bold"
                  style={{
                    color: colors.openBackgroundColor,
                  }}
                >
                  {org?.start}
                </MyText>
              </View>
              <Text style={{ marginBottom: 5 }}> - </Text>
              <View
                style={[
                  styles.subCon,
                  { backgroundColor: colors.closeBackgroundColor },
                ]}
              >
                <MyText
                  poppins="Bold"
                  style={{
                    color: colors.closeTextColor,
                  }}
                >
                  {org?.end}
                </MyText>
              </View>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
      <View
        style={{
          marginLeft: 10,

          marginBottom: -30,
        }}
      >
        <Image
          style={styles.image}
          source={require('../../../assets/images/instruction.png')}
          resizeMode="contain"
        />
      </View>

      <Representatives data={staffs} />
    </ScrollView>
  );
};

export default Reception;
const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
});

const Representatives = ({ data }: { data: WorkerWithWorkspace[] }) => {
  console.log('🚀 ~ Representatives ~ data:', data[0].workspaceId);

  return (
    <FlatList
      ListHeaderComponent={() => (
        <Text
          style={{
            color: 'black',
            fontSize: 12,
            fontFamily: 'PoppinsBold',
            marginBottom: 20,
          }}
        >
          Representatives
        </Text>
      )}
      scrollEnabled={false}
      data={data}
      renderItem={({ item }) => <RepresentativeItem item={item} />}
    />
  );
};

const RepresentativeItem = ({ item }: { item: WorkerWithWorkspace }) => {
  const router = useRouter();
  const { id } = useData();
  const handlePress = async () => {
    const { error } = await supabase.from('waitList').upsert({
      workspace: item?.workspaceId?.id,
      customer: id,
    });
    if (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try joining again',
      });
    }

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Welcome to our workspace',
        text2: 'Please be in a quiet place',
      });
      router.replace(`/wk/${item?.workspaceId?.id}`);
    }
  };
  return (
    <Pressable
      style={({ pressed }) => [{ width: '33%', opacity: pressed ? 0.5 : 1 }]}
      onPress={handlePress}
    >
      <VStack flex={1} alignItems="center" justifyContent="center" gap={2}>
        <Avatar.Image source={{ uri: item?.userId.avatar }} size={50} />
        <MyText poppins="Medium" fontSize={11} style={{ textAlign: 'center' }}>
          {item?.role}
        </MyText>

        {item?.workspaceId?.active && (
          <View
            style={{
              backgroundColor: colors.openTextColor,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
            }}
          >
            <MyText
              poppins="Bold"
              style={{ color: colors.openBackgroundColor }}
            >
              Active
            </MyText>
          </View>
        )}
        {!item?.workspaceId?.active && (
          <View
            style={{
              backgroundColor: colors.closeTextColor,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
            }}
          >
            <MyText
              poppins="Bold"
              style={{ color: colors.closeBackgroundColor }}
            >
              Inactive
            </MyText>
          </View>
        )}
      </VStack>
    </Pressable>
  );
};
