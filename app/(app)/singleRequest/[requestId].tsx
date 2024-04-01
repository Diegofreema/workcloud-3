import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useGetRequest, usePendingRequest } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { router, useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { HStack, VStack } from '@gluestack-ui/themed';
import { MyText } from '@/components/Ui/MyText';
import { Image } from 'expo-image';
import { MyButton } from '@/components/Ui/MyButton';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

type Props = {};

const Request = (props: Props) => {
  const { requestId } = useLocalSearchParams();
  const { id } = useData();
  const queryClient = useQueryClient();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetRequest(requestId);
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  console.log('🚀 ~ Request ~ data:', data?.requestExists?.workspaceId);

  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  console.log(data?.requestExists?.workspaceId);

  const { requestExists } = data;
  const acceptRequest = async () => {
    setAccepting(true);
    try {
      const { data: res } = await axios.post(
        `http://192.168.240.212:3000/workspace/assign`,
        {
          workspaceId: data?.requestExists?.workspaceId,
          id: id,
          salary: requestExists?.salary,
          responsibilities: requestExists?.responsibility,
          requestId: requestExists?._id,
          bossId: requestExists?.from?._id,
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Request has been accepted',
      });
      queryClient.invalidateQueries({
        queryKey: [
          'request',
          'single',
          'worker',
          'pending_requests',
          'pending_worker',
          'myStaffs',
        ],
      });

      console.log(res);

      router.push(`/wk/${data?.requestExists?.workspaceId}`);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setAccepting(false);
    }
  };

  const rejectRequest = async () => {
    setCancelling(true);
    try {
      await axios.post(`http://192.168.240.212:3000/request/delete`, {
        id: data?.requestExists?._id,
      });
      Toast.show({
        type: 'success',
        text1: 'Request Canceled',
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setCancelling(false);
    }
  };
  return (
    <Container flex={1}>
      <HeaderNav title="Request" />
      <VStack>
        <View style={{ marginBottom: 20 }}>
          <Image
            source={requestExists?.from?.organizations?.avatar.url}
            style={{ width: '100%', height: 200, borderRadius: 6 }}
            contentFit="cover"
          />
        </View>
        <MyText
          fontSize={18}
          poppins="Medium"
          style={{ textTransform: 'capitalize' }}
        >
          {formatDistanceToNow(requestExists?.createdAt)} ago
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          From : {requestExists?.from?.organizations?.organizationName}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Responsibilities : {requestExists?.responsibility}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Salary : {requestExists?.salary}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Role : {requestExists?.role}
        </MyText>
      </VStack>
      <HStack mt={'auto'} mb={30} gap={10}>
        <MyButton
          loading={cancelling}
          buttonColor="red"
          style={{ width: '50%' }}
          onPress={rejectRequest}
        >
          Decline
        </MyButton>
        <MyButton
          loading={accepting}
          style={{ width: '50%' }}
          onPress={acceptRequest}
        >
          Accept
        </MyButton>
      </HStack>
    </Container>
  );
};

export default Request;
