import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useOrganizationModal } from '../hooks/useOrganizationModal';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

type Props = {};

export const OrganizationModal = ({}: Props): JSX.Element => {
  const { user } = useUser();
  const { isOpen, onClose } = useOrganizationModal();
  const router = useRouter();

  const createOrganization = () => {
    router.push('/create-workspace');
    onClose();
  };
  const connectToOrganization = () => {
    router.push('/organizations');
    onClose();
  };
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onClose}>
        <View style={{ alignItems: 'center' }}>
          <Text
            variant="titleMedium"
            style={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Hi {user?.firstName || ''}
          </Text>
          <Feather
            name="x"
            style={{ position: 'absolute', right: 15, top: -8 }}
            size={20}
            onPress={onClose}
          />
        </View>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: 'black',
            marginTop: 10,
          }}
        />
        <Dialog.Content style={{ padding: 10, alignItems: 'center' }}>
          <Text
            variant="bodyMedium"
            style={{ width: '50%', textAlign: 'center' }}
          >
            Start your journey on workcloud
          </Text>
          <View style={{ gap: 15, marginTop: 20 }}>
            <Button
              buttonColor={colors.buttonBlue}
              mode="elevated"
              textColor="white"
              onPress={createOrganization}
            >
              Create An Organization
            </Button>
            <Button
              buttonColor="#C0D1FE"
              textColor={colors.buttonBlue}
              mode="elevated"
              onPress={connectToOrganization}
            >
              Connect To An Organization
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center' }}>
          <Button
            labelStyle={{ textAlign: 'center' }}
            onPress={onClose}
            textColor="blue"
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({});
