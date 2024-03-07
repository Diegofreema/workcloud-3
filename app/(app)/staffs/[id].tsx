import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGetPersonalWorkers } from '@/lib/queries';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { AuthHeader } from '@/components/AuthHeader';
import { MyText } from '@/components/Ui/MyText';
import { colors } from '@/constants/Colors';
import { Pressable } from 'react-native';
import { DottedButton } from '@/components/Ui/DottedButton';
import { Workers } from '@/constants/types';
import { AddStaff } from '@/components/Dialogs/AddStaff';
import { useAddStaff } from '@/hooks/useAddStaff';
import { SelectNewRow } from '@/components/Dialogs/SelectNewRow';
import { HStack } from '@gluestack-ui/themed';

type Props = {};
const allRoles = [
  'All',
  'Customer service',
  'Sales Representative',
  'Account opening',
  'Logistics',
  'ICT',
];
const Staffs = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workers, setWorkers] = useState<Workers[] | undefined>([]);
  const { onClose, onOpen } = useAddStaff();
  const [role, setRole] = useState('All');
  const router = useRouter();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetPersonalWorkers(id);
  useEffect(() => {
    if (
      !isPending ||
      !isRefetching ||
      !isError ||
      !isRefetchError ||
      !isPaused
    ) {
      setWorkers(data?.worker);
    }
  }, []);

  useEffect(() => {
    const filterData = data?.worker?.filter((worker) =>
      role === 'All' ? workers : worker.role === role
    );

    setWorkers(filterData);
  }, [role]);
  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const pendingStaffs = () => {
    router.push('/pending-staffs');
  };

  return (
    <View style={styles.container}>
      <AddStaff />
      <SelectNewRow id={id} />
      <AuthHeader path="Staffs" />
      <View style={{ marginBottom: 15 }}>
        <FlatList
          horizontal
          style={{ marginBottom: 10 }}
          showsHorizontalScrollIndicator={false}
          data={allRoles}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.buttonStyle,
                pressed && { opacity: 0.5 },
                role === item && styles.activeButton,
              ]}
              onPress={() => setRole(item)}
            >
              <MyText
                style={{ color: role === item ? 'white' : 'black' }}
                poppins="Medium"
                fontSize={13}
              >
                {item}
              </MyText>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
        <HStack gap={10}>
          <DottedButton text="Add New Staff" onPress={onOpen} />
          <DottedButton
            isIcon={false}
            text="Pending Staffs"
            onPress={pendingStaffs}
          />
        </HStack>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isRefetching}
        data={workers}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        ListEmptyComponent={() => (
          <MyText poppins="Bold" style={{ textAlign: 'center' }} fontSize={20}>
            No Staffs yet
          </MyText>
        )}
      />
    </View>
  );
};

export default Staffs;

type PropsBottom = {
  role: string;
  setRole: (role: string) => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  buttonStyle: {
    backgroundColor: colors.buttonSmall,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  activeButton: {
    backgroundColor: colors.dialPad,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
