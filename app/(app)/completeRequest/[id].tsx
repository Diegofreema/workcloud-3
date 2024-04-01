import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetWorkerProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Center, VStack } from '@gluestack-ui/themed';
import { InputComponent } from '@/components/InputComponent';
import { MyButton } from '@/components/Ui/MyButton';
import { useAddStaff } from '@/hooks/useAddStaff';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { useSaved } from '@/hooks/useSaved';
import { CompleteDialog } from '@/components/Dialogs/SavedDialog';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
import axios from 'axios';
type Props = {};
const validationSchema = yup.object().shape({
  role: yup.string().required('Role is required'),
  responsibility: yup.string().required('responsibility is required'),
  salary: yup.string().required('salary is required'),
});

const CompleteRequest = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { workspaceId, role: workerRole, orgId } = useDetailsToAdd();
  console.log(
    '🚀 ~ CompleteRequest ~ workspaceId',
    'orgId',
    workspaceId,
    workerRole,
    orgId
  );

  const { onOpen, isOpen, onClose } = useSaved();
  const { id: isMe, user } = useData();

  console.log('🚀 ~ CompleteRequest ~ isMe:', isMe);
  const queryClient = useQueryClient();
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

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      role: '',
      responsibility: '',
      salary: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { responsibility, salary } = values;
      try {
        const { error } = await supabase.from('request').insert({
          from: isMe,
          to: data?.worker?.userId?.userId,
          responsibility,
          salary,
          role: workerRole,
          workspaceId,
          organizationId: orgId,
        });

        if (!error) {
          Toast.show({
            type: 'success',
            text1: 'Request sent',
          });
          queryClient.invalidateQueries({
            queryKey: ['request'],
          });

          router.push('/pending-staffs');
        }

        if (error) {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'Error, failed to send request',
          });
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error, failed to send request',
        });
      }
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setTimeout(() => {
        router.push('/allStaffs');
        onClose();
      }, 1500);
    }

    return () => clearTimeout(interval);
  }, [isOpen]);
  useEffect(() => {
    if (workerRole) {
      setValues({ ...values, role: workerRole });
    }
  }, [workerRole]);
  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const { responsibility, role, salary } = values;
  const { worker } = data;
  return (
    <Container>
      <HeaderNav title="Complete Request" />
      <CompleteDialog text="Request sent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={{ marginTop: 10 }}>
          <UserPreview
            imageUrl={worker?.userId?.avatar}
            name={worker?.userId?.name}
            roleText={worker?.role}
            workPlace={worker?.organizationId?.name}
            personal
          />
        </View>

        <VStack mt={30} gap={10}>
          <>
            <InputComponent
              label="Role"
              value={role}
              onChangeText={handleChange('role')}
              placeholder="Assign a role"
              keyboardType="email-address"
            />
            {touched.role && errors.role && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.role}
              </Text>
            )}
          </>

          <>
            <InputComponent
              label="Responsibility"
              value={responsibility}
              onChangeText={handleChange('responsibility')}
              placeholder="What will this person do i your workspace?"
              keyboardType="default"
              multiline
              numberOfLines={4}
            />
            {touched.responsibility && errors.responsibility && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.responsibility}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Salary"
              value={salary}
              onChangeText={handleChange('salary')}
              placeholder="Input a salary range"
              keyboardType="default"
            />
            {touched.salary && errors.salary && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.salary}
              </Text>
            )}
          </>
        </VStack>

        <MyButton
          loading={isSubmitting}
          onPress={() => handleSubmit()}
          style={{ marginTop: 30 }}
        >
          Send Request
        </MyButton>
      </ScrollView>
    </Container>
  );
};

export default CompleteRequest;

const styles = StyleSheet.create({});
