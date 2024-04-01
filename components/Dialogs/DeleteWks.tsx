import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCreate } from '../../hooks/useCreate';
import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';

import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectRow } from '../../hooks/useSelectRow';
import { useQueryClient } from '@tanstack/react-query';
import { MyButton } from '../Ui/MyButton';
import { useDeleteWks } from '@/hooks/useDeleteWks';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useData } from '@/hooks/useData';

export const DeleteWksSpaceModal = () => {
  const { onClose, id, isOpen } = useDeleteWks();
  const { id: userId } = useData();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const deleteWks = async () => {
    try {
      const { error } = await supabase.from('workspace').delete().eq('id', id);
      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Workspace deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['wks', userId] });
      }

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }

      onClose();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setDeleting(false);
    }
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
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{ verticalAlign: 'middle', marginBottom: 15 }}
          >
            Are you sure you want to delete this workspace?
          </MyText>

          <HStack gap={10}>
            <MyButton
              disabled={deleting}
              buttonColor={colors.closeTextColor}
              contentStyle={{ padding: 5 }}
              onPress={deleteWks}
              labelStyle={{ fontSize: 15 }}
            >
              Delete
            </MyButton>
            <MyButton
              contentStyle={{ padding: 5 }}
              onPress={onClose}
              labelStyle={{ fontSize: 15 }}
            >
              Cancel
            </MyButton>
          </HStack>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    padding: 30,
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: 'absolute',
    top: 10,
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
