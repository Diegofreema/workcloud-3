import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthHeader } from '@/components/AuthHeader';
import { HeaderNav } from '@/components/HeaderNav';
import { useGetWaitList, useGetWk } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { HStack, VStack } from '@gluestack-ui/themed';
import { MyButton } from '@/components/Ui/MyButton';
import { colors } from '@/constants/Colors';
import { BottomSheet } from '@rneui/themed';
import { Avatar, IconButton, Switch } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { MyText } from '@/components/Ui/MyText';
import { WaitList } from '@/constants/types';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { AddToCall } from '@/components/Dialogs/AddToCall';
import { useToken } from '@/hooks/useToken';
type Props = {};

const Work = (props: Props) => {
  const { id } = useLocalSearchParams();
  console.log('🚀 ~ Work ~ id:', id);
  const { id: userId } = useData();
  const [isActive, setIsActive] = useState(false);
  const [isLeisure, setIsLeisure] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { onOpen, generateToken, token, getWorkspaceId } = useToken();
  const queryClient = useQueryClient();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetWk(id);
  const {
    data: waitListData,
    isPaused: isPausedWaitList,
    isPending: isPendingWaitList,
    isError: isErrorWaitList,
    refetch: refetchWaitList,
    isRefetching: isRefetchRefetchWaitList,
    isRefetchError: isRefetchRefetchRefetchWaitList,
  } = useGetWaitList(id);
  useEffect(() => {
    if (data) {
      setIsActive(data?.wks?.active);
      setIsLeisure(data?.wks?.leisure);
    }
  }, [data]);
  useEffect(() => {
    const channel = supabase
      .channel('workspace')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspace',
        },
        (payload) => {
          if (payload) {
            queryClient.invalidateQueries({ queryKey: ['wk', id] });
          }
          console.log('Change received!', payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitList',
        },
        (payload) => {
          if (payload) {
            queryClient.invalidateQueries({ queryKey: ['waitList', id] });
          }
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefetch = () => {
    refetch();
    refetchWaitList();
  };
  if (
    isError ||
    isRefetchError ||
    isPaused ||
    isPausedWaitList ||
    isErrorWaitList
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPending || isPendingWaitList) {
    return <LoadingComponent />;
  }
  const showModal = () => {
    setIsVisible(true);
  };
  const onProcessors = () => {};
  const signOff = () => {};
  const onClose = () => {
    setIsVisible(false);
  };
  const { wks } = data;

  const { waitList, error } = waitListData;
  console.log('🚀 ~ Work ~ waitList:', waitList);
  const createAndSendMail = async (item: WaitList) => {
    generateToken();
    try {
      const { data } = await axios.post(
        'https://workcloud-server.vercel.app/auth/send-mail',
        {
          email: item?.customer?.email,
          name: item?.customer?.name,
          token: token,
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Code has been resent',
        text2: data.message,
      });
      router.replace(`/video/call/${token}`);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error, something went wrong',
        text2: error?.response?.data.error,
      });
    }
  };
  const openModal = () => {
    onOpen();
  };
  const onAddToCall = (item: WaitList) => {
    getWorkspaceId(item?.id);
    if (userId === wks?.workerId?.userId) {
      createAndSendMail(item);

      return;
    }

    if (userId === item.customer?.userId) {
      openModal();
    }
  };
  return (
    <>
      <AddToCall />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <HeaderNav
          title="Workspace"
          subTitle={`${wks.organizationId.name} lobby`}
        />
        <View style={{ marginTop: 20 }} />
        <UserPreview
          name={wks.workerId.name}
          imageUrl={wks.workerId.avatar}
          subText={wks.role}
          workspace
          active={wks.active}
        />
        <Buttons
          onShowModal={showModal}
          onProcessors={onProcessors}
          onSignOff={signOff}
        />

        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            gap: 10,
            width: '100%',
          }}
          columnWrapperStyle={{ gap: 10 }}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <HStack gap={5} alignItems="center" my={20}>
              <Text style={{ color: 'black', fontFamily: 'PoppinsBold' }}>
                Waiting in your lobby
              </Text>
              <View style={styles.rounded}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'PoppinsMedium',
                    fontSize: 12,
                  }}
                >
                  {waitList?.length}
                </Text>
              </View>
            </HStack>
          )}
          scrollEnabled={false}
          data={waitList}
          renderItem={({ item }) => (
            <Profile item={item} onAddToCall={onAddToCall} />
          )}
        />
        <BottomActive
          id={id}
          onClose={onClose}
          active={isActive}
          leisure={isLeisure}
          isVisible={isVisible}
        />
      </ScrollView>
    </>
  );
};

export default Work;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    color: 'black',
    fontSize: 17,
    fontFamily: 'PoppinsBold',
  },
  text: { color: 'black', fontFamily: 'PoppinsLight' },
  rounded: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
});

type ButtonProps = {
  onShowModal: () => void;
  onProcessors: () => void;
  onSignOff: () => void;
};
const Buttons = ({ onShowModal, onProcessors, onSignOff }: ButtonProps) => {
  return (
    <HStack width={'100%'} justifyContent={'space-between'} gap={10} mt={20}>
      <MyButton
        onPress={onShowModal}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.dialPad,
        }}
        labelStyle={{ color: colors.dialPad }}
        contentStyle={{ flex: 1 }}
      >
        Set status
      </MyButton>
      <MyButton
        onPress={onProcessors}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.dialPad,
        }}
        labelStyle={{ color: colors.dialPad }}
      >
        Processors
      </MyButton>
      <MyButton
        onPress={onSignOff}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'red',
        }}
        labelStyle={{ color: 'red' }}
      >
        Sign off
      </MyButton>
    </HStack>
  );
};

const Profile = ({
  item,
  onAddToCall,
}: {
  item: WaitList;
  onAddToCall: (item: WaitList) => void;
}) => {
  return (
    <Pressable style={{ width: '25%' }} onPress={() => onAddToCall(item)}>
      <VStack flex={1} alignItems="center" justifyContent="center">
        <Avatar.Image size={50} source={{ uri: item?.customer?.avatar }} />
        <MyText poppins="Medium" fontSize={13}>
          {item?.customer?.name.split(' ')[0]}
        </MyText>
        <MyText poppins="Light" fontSize={10} style={{ textAlign: 'center' }}>
          {formatDistanceToNow(item.created_at)}
        </MyText>
      </VStack>
    </Pressable>
  );
};

const BottomActive = ({
  onClose,
  active,
  leisure,
  isVisible,
  id,
}: {
  onClose: () => void;
  active: boolean;
  leisure: boolean;
  isVisible: boolean;
  id: any;
}) => {
  const toggleActive = async () => {
    const { error } = await supabase
      .from('workspace')
      .update({ active: !active })
      .eq('id', id);
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update active status',
        text2: 'Something went wrong',
      });
    }

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Active status updated',
        text2: 'Your active status has been updated',
      });
    }
  };

  const toggleLeisure = async () => {
    const { error } = await supabase
      .from('workspace')
      .update({ leisure: !leisure })
      .eq('id', id);
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update leisure status',
        text2: 'Something went wrong',
      });
    }

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Active status updated',
        text2: 'Your active status has been updated',
      });
    }
  };
  return (
    <BottomSheet
      modalProps={{}}
      onBackdropPress={onClose}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        style: {
          backgroundColor: 'white',
          padding: 10,
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          height: '40%',
        },
        contentContainerStyle: {
          height: '100%',
        },
      }}
      isVisible={isVisible}
    >
      <HStack
        width={'100%'}
        justifyContent={'center'}
        alignItems="center"
        gap={10}
        mt={20}
      >
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontFamily: 'PoppinsBold',
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Set status
        </Text>
        <IconButton
          icon="close"
          onPress={onClose}
          iconColor="black"
          style={{ position: 'absolute', right: 5, top: -10 }}
        />
      </HStack>

      <VStack gap={10} mx={10} mt={20}>
        <HStack alignItems="center" gap={5}>
          <VStack>
            <Text style={styles.header}>Active</Text>
            <Text style={styles.text}>
              This shows if you are active or not active
            </Text>
          </VStack>
          <Switch value={active} onValueChange={toggleActive} />
        </HStack>
        <HStack alignItems="center" gap={10}>
          <VStack>
            <Text style={styles.header}>Leisure</Text>
            <Text style={styles.text}>
              This shows that you are not completely active, probably on a break
            </Text>
          </VStack>
          <Switch value={leisure} onValueChange={toggleLeisure} />
        </HStack>
      </VStack>
    </BottomSheet>
  );
};
