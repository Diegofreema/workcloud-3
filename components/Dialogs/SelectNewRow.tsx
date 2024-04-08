import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';

import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';
import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectNewRow } from '../../hooks/useSelectNewRow';
import { Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import axios from 'axios';
import { Wks } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import { useData } from '@/hooks/useData';

const roles = [
  { role: 'Customer service' },
  { role: 'Sales Representative' },
  { role: 'Account opening processor' },
  { role: 'Logistics' },
  { role: 'ICT Processor' },
];
export const SelectNewRow = ({ id }: { id: string }) => {
  const { isOpen, onClose } = useSelectNewRow();
  const { getData } = useDetailsToAdd();
  const { id: userId } = useData();
  const queryClient = useQueryClient();
  const [workspace, setWorkspace] = useState<Wks[]>();
  console.log('🚀 ~ SelectNewRow ~ workspace:', workspace);

  const router = useRouter();
  useEffect(() => {
    const getWks = async () => {
      const { data, error } = await supabase
        .from('workspace')
        .select()
        .eq('ownerId', userId);
      if (!error) {
        setWorkspace(data);
      }
      return data;
    };
    const getWorkspaces = async () => {
      try {
        await queryClient.fetchQuery({
          queryKey: ['wks', userId],
          queryFn: getWks,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getWorkspaces();
  }, []);

  const navigate = (item: Wks) => {
    console.log('🚀 ~ navigate ~ item:', item.organizationId);

    onClose();
    getData(item.role, item.id, item.organizationId);
    router.push(`/allStaffs`);
  };

  return (
    <View>
      <Modal
        hasBackdrop={false}
        onDismiss={onClose}
        animationIn={'slideInDown'}
        isVisible={isOpen}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <View style={styles.centeredView}>
          <MyText poppins="Medium" fontSize={15}>
            Select role
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome name="times" size={20} color="black" />
          </Pressable>
          <Divider style={[styles.divider, { marginBottom: -10 }]} />
          <View style={{ marginTop: 20, width: '100%', gap: 14 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={workspace}
              ItemSeparatorComponent={() => <Divider style={styles.divider} />}
              keyExtractor={(item) => item.role}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigate(item)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    p={10}
                  >
                    <MyText fontSize={13} poppins="Medium">
                      {item?.role}
                    </MyText>
                  </HStack>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 15,
  },
  trash: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
    borderRadius: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
  button: {
    position: 'absolute',
    top: 7,
    right: 15,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
});
