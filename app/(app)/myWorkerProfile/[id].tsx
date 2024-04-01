import { StyleSheet, View } from 'react-native';
import React from 'react';
import { HStack, ScrollView, VStack } from '@gluestack-ui/themed';
import { HeaderNav } from '@/components/HeaderNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetWorkerProfile, usePendingWorkers } from '@/lib/queries';
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
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '@clerk/clerk-expo';
import { useData } from '@/hooks/useData';
type Props = {};

const Profile = (props: Props) => {
  const { id } = useData();
  console.log('🚀 ~ Profile ~ id:', id);
  const { client } = useChatContext();

  const router = useRouter();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetWorkerProfile(id);
  console.log('🚀 ~ Profile ~ data:', data);

  const queryClient = useQueryClient();
  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  console.log(data);
  const { worker } = data;
  const formattedSkills = (text: string) => {
    const arrayOfSkills = text.split(',');
    const finishedText = arrayOfSkills.map((skill, index) => (
      <View key={index} style={{ width: '100%' }}>
        <MyText poppins="Bold" style={{ color: colors.nine }}>
          {index + 1}. {skill}
        </MyText>
      </View>
    ));
    return finishedText;
  };

  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <HeaderNav title="Profile" />
      <View style={{ marginTop: 10 }}>
        <UserPreview
          imageUrl={worker?.userId?.avatar}
          name={worker?.userId?.name}
          roleText={worker?.assignedWorkspace}
          personal
        />
      </View>

      <VStack mt={20} gap={15}>
        <HStack gap={5} alignItems="center">
          <AntDesign name="calendar" size={24} color={colors.grayText} />
          <MyText
            fontSize={12}
            poppins="Medium"
            style={{ color: colors.grayText }}
          >
            Joined since {format(worker.created_at, 'do MMMM yyyy')}
          </MyText>
        </HStack>
        <HStack gap={5} alignItems="center">
          <EvilIcons name="location" size={24} color={colors.grayText} />
          <MyText
            fontSize={12}
            poppins="Medium"
            style={{ color: colors.grayText }}
          >
            {worker?.location}
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
            {worker?.qualifications}
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
            {worker?.experience}
          </MyText>
        </HStack>
      </VStack>

      <VStack mt={20}>
        <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
          Skills
        </MyText>

        <HStack
          gap={10}
          pb={40}
          style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
        >
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={24}
            color="black"
          />

          <VStack gap={5} alignItems="flex-start">
            {formattedSkills(worker?.skills)}
          </VStack>
        </HStack>
      </VStack>
      <View style={{ marginTop: 'auto', gap: 10 }}>
        <MyButton onPress={() => router.push(`/myWorkerProfile/edit/${id}`)}>
          <MyText poppins="Bold" style={{ color: colors.white }} fontSize={12}>
            Edit work profile
          </MyText>
        </MyButton>
        <MyButton onPress={() => router.push(`/requests/${id}`)}>
          <MyText poppins="Bold" style={{ color: colors.white }} fontSize={12}>
            Check requests
          </MyText>
        </MyButton>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
