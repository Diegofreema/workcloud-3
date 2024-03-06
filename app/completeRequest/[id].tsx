import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetSingleWorker } from '@/lib/queries';
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
type Props = {};
const validationSchema = yup.object().shape({
  role: yup.string().required('Role is required'),

  responsibility: yup.string().required('responsibility is required'),

  salary: yup.string().required('salary is required'),
});

const CompleteRequest = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role: workerRole } = useDetailsToAdd();
  const { onOpen, isOpen, onClose } = useSaved();
  const { userId, isLoaded } = useAuth();
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
  } = useGetSingleWorker(id);

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
      const { role, responsibility, salary } = values;
      const { error } = await supabase.from('requests').insert({
        role,
        responsibility,
        salary,
        employerId: userId,
        workerId: id,
        status: 'pending',
      });
      if (error?.code === '23503') {
        return Toast.show({
          type: 'error',
          text1: 'Worker not found',
          text2: 'Please try with another worker',
        });
      }
      if (error) {
        console.log(error);

        return Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again',
        });
      }
      if (!error) {
        queryClient.invalidateQueries({
          queryKey: ['pending_worker'],
        });
        resetForm();
        onOpen();
      }

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again',
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
            imageUrl={data?.worker[0]?.imageUrl}
            name={data?.worker[0]?.name}
            roleText={data?.worker[0]?.role}
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
