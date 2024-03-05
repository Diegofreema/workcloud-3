import React from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';
// import { Plus, X } from 'lucide-react-native';
import { useCreate } from '../../hooks/useCreate';
import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';

import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectRow } from '../../hooks/useSelectRow';
import { useGetWks } from '../../lib/queries';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { ErrorComponent } from '../Ui/ErrorComponent';
import { useQueryClient } from '@tanstack/react-query';
import { Wks } from '@/constants/types';
import { AntDesign, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useDeleteWks } from '@/hooks/useDeleteWks';

const links = [
  {
    text: 'Customer service',
  },
  {
    text: 'Sales Representative',
  },
];
export const CreateWorkspaceModal = ({ wks }: { wks: Wks[] }) => {
  const { isOpen, onClose } = useCreate();
  const { onOpen: onSelectRow, onClose: onCloseRow } = useSelectRow();
  const { onOpen: onOpenDelete, getId } = useDeleteWks();
  const queryClient = useQueryClient();

  const handleClose = () => {
    onClose();
    onSelectRow();
  };
  const onDelete = (id: any) => {
    getId(id);
    onOpenDelete();
    onClose();
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
          <MyText poppins="Bold" fontSize={20}>
            Your workspaces
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome
              name="times"
              size={24}
              color="black"
              style={{ fontWeight: '300' }}
            />
          </Pressable>
          <View style={styles.row}>
            <AntDesign name="plus" size={24} color="black" />
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                { padding: 5 },
              ]}
            >
              <MyText poppins="Light" fontSize={15}>
                Create personal WKS
              </MyText>
            </Pressable>
          </View>
          <View style={{ marginTop: 20, width: '100%' }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <MyText
                  style={{ textAlign: 'center' }}
                  poppins="Medium"
                  fontSize={16}
                >
                  No WKS
                </MyText>
              )}
              data={wks}
              renderItem={({ item }) => (
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  mb={15}
                  mx={5}
                >
                  <MyText fontSize={13} poppins="Medium">
                    {item?.role}
                  </MyText>
                  <Pressable
                    style={({ pressed }) => [
                      styles.trash,
                      { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => onDelete(item?.id)}
                  >
                    <EvilIcons
                      name="trash"
                      size={24}
                      color={colors.closeTextColor}
                    />
                  </Pressable>
                </HStack>
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
    padding: 10,
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
