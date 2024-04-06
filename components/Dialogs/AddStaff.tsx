import React, { useState } from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';

import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';
import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectNewRow } from '../../hooks/useSelectNewRow';
import { Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import { useAuth } from '@clerk/clerk-expo';
import { usePersonalOrgs } from '../../lib/queries';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';
import { useAddStaff } from '@/hooks/useAddStaff';

const roles = [{ role: 'Add new staff' }];
export const AddStaff = () => {
  const { isOpen, onClose } = useAddStaff();
  const { onOpen: onOpenSelectRowModal } = useSelectNewRow();
  const queryClient = useQueryClient();
  const router = useRouter();

  const onOpenSelectRow = () => {
    onClose();
    onOpenSelectRowModal();
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
            Add Staff
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
              data={roles}
              ItemSeparatorComponent={() => <Divider style={styles.divider} />}
              keyExtractor={(item) => item.role}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onOpenSelectRow()}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    p={10}
                  >
                    <MyText fontSize={13} poppins="Medium">
                      {item.role}
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
