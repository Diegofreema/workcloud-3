import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, ScrollView, VStack } from '@gluestack-ui/themed';
import { HeaderNav } from '@/components/HeaderNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetSingleWorker, usePendingWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { MyButton } from '@/components/Ui/MyButton';
import { colors } from '@/constants/Colors';
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { MyText } from '@/components/Ui/MyText';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
type Props = {};

const Profile = (props: Props) => {
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  const [requestPending, setRequestPending] = useState(false);
  const router = useRouter();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetSingleWorker(profileId);
  const {
    data: pendingData,
    isPending: isPendingData,
    isError: isErrorData,
    refetch: refetchData,
    isRefetching: isRefetchingData,
    isRefetchError: isRefetchErrorData,
  } = usePendingWorkers();
  const queryClient = useQueryClient();
  if (
    isError ||
    isRefetchError ||
    isPaused ||
    isErrorData ||
    isRefetchErrorData ||
    pendingData?.error ||
    data?.error
  ) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending || isPendingData) {
    return <LoadingComponent />;
  }

  const isInPending = !!pendingData?.requests?.find(
    (worker) => worker.workerId === +profileId
  );

  const requestToCancel = pendingData?.requests?.find(
    (worker) => worker.workerId === +profileId
  );

  const formattedSkills = (text: string) => {
    if (text.includes(',')) {
      const arrayOfSkills = text.split(',');
      const finishedText = arrayOfSkills.map((skill, index) => (
        <MyText poppins="Bold" key={index} style={{ color: colors.nine }}>
          {index + 1}. {skill}
        </MyText>
      ));
      return finishedText;
    } else {
      return text;
    }
  };
  const sendMessage = () => {};
  const cancelRequest = async () => {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', requestToCancel?.id);
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error while cancelling request',
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['pending_worker'],
      });
      Toast.show({
        type: 'success',
        text1: 'Request Cancelled',
      });
    }
  };
  const handleRequest = () => {
    if (isInPending) {
      return cancelRequest();
    }

    router.push(`/completeRequest/${profileId}`);
  };
  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <HeaderNav title="Profile" />
      <View style={{ marginTop: 10 }}>
        <UserPreview
          imageUrl={data?.worker[0]?.imageUrl}
          name={data?.worker[0]?.name}
          roleText={data?.worker[0]?.role}
          personal
        />
      </View>

      <HStack gap={20} mt={20}>
        <MyButton
          onPress={handleRequest}
          buttonColor={colors.dialPad}
          style={{ borderRadius: 8, height: 45 }}
        >
          {isInPending ? 'Cancel Request' : 'Send Request'}
        </MyButton>
        <MyButton
          onPress={sendMessage}
          buttonColor={colors.lightBlueButton}
          textColor={colors.dialPad}
          style={{ borderRadius: 8, height: 45 }}
        >
          Send Message
        </MyButton>
      </HStack>

      <VStack mt={20} gap={15}>
        <HStack gap={5} alignItems="center">
          <AntDesign name="calendar" size={24} color={colors.grayText} />
          <MyText
            fontSize={12}
            poppins="Medium"
            style={{ color: colors.grayText }}
          >
            Joined since {format(data?.worker[0]?.created_at, 'do MMMM yyyy')}
          </MyText>
        </HStack>
        <HStack gap={5} alignItems="center">
          <EvilIcons name="location" size={24} color={colors.grayText} />
          <MyText
            fontSize={12}
            poppins="Medium"
            style={{ color: colors.grayText }}
          >
            {data?.worker[0]?.location}
          </MyText>
        </HStack>
      </VStack>

      <VStack mt={20}>
        <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
          Qualifications
        </MyText>

        <HStack
          gap={10}
          alignItems="center"
          pb={40}
          style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
        >
          <SimpleLineIcons name="graduation" size={24} color="black" />
          <MyText poppins="Medium" fontSize={12}>
            {data?.worker[0]?.qualification}
          </MyText>
        </HStack>
      </VStack>
      <VStack mt={20}>
        <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
          Experience and Specialization
        </MyText>

        <HStack
          gap={10}
          alignItems="center"
          pb={40}
          style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
        >
          <SimpleLineIcons name="graduation" size={24} color="black" />
          <MyText poppins="Medium" fontSize={12}>
            {data?.worker[0]?.exp}
          </MyText>
        </HStack>
      </VStack>

      <VStack mt={20}>
        <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
          Skills
        </MyText>

        <HStack
          gap={10}
          alignItems="center"
          pb={40}
          style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
        >
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={24}
            color="black"
          />
          <MyText poppins="Medium" fontSize={12}>
            {formattedSkills(data?.worker[0]?.skill)}
          </MyText>
        </HStack>
      </VStack>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
