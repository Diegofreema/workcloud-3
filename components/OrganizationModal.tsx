import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useOrganizationModal } from '../hooks/useOrganizationModal';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { MyText } from './Ui/MyText';

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

  const createWorkerProfile = () => {
    router.push('/create-worker-profile');
    onClose();
  };
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onClose} style={styles.dialog}>
        <View style={{ alignItems: 'center' }}>
          <MyText poppins="Bold" fontSize={20} style={{ textAlign: 'center' }}>
            Hi {user?.firstName || ''}
          </MyText>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              { position: 'absolute', right: 15, top: -8 },
            ]}
          >
            <Feather name="x" size={20} />
          </Pressable>
        </View>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: 'white',
            marginTop: 10,
          }}
        />
        <Dialog.Content style={{ padding: 10, alignItems: 'center' }}>
          <MyText
            poppins="Medium"
            fontSize={15}
            style={{ width: '100%', textAlign: 'center' }}
          >
            Start your journey on workcloud
          </MyText>
          <View style={{ gap: 15, marginTop: 20 }}>
            <Button
              buttonColor={colors.buttonBlue}
              mode="elevated"
              textColor="white"
              onPress={createOrganization}
              labelStyle={{ fontFamily: 'PoppinsLight' }}
            >
              Create An Organization
            </Button>
            <Button
              buttonColor="#C0D1FE"
              textColor={colors.buttonBlue}
              mode="elevated"
              onPress={connectToOrganization}
              labelStyle={{ fontFamily: 'PoppinsLight' }}
            >
              Connect To An Organization
            </Button>
            <Button
              buttonColor={colors.lightBlue}
              textColor={colors.buttonBlue}
              mode="elevated"
              onPress={createWorkerProfile}
              labelStyle={{ fontFamily: 'PoppinsLight', color: 'white' }}
            >
              Register as a worker
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center' }}>
          <Button
            labelStyle={{ textAlign: 'center', fontFamily: 'PoppinsBold' }}
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

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
  },
});
