import { StyleSheet, View, Text, Image } from 'react-native';
import { Dialog } from 'react-native-paper';
import { MyText } from '../Ui/MyText';
import { useSaved } from '../../hooks/useSaved';

type Props = {};

export const SavedDialog = ({}: Props): JSX.Element => {
  const { isOpen, onClose } = useSaved();
  return (
    <Dialog style={styles.dialog} visible={isOpen} onDismiss={onClose}>
      <MyText poppins="Medium" fontSize={15} style={{ marginBottom: 30 }}>
        Changes saved successfully
      </MyText>
      <Dialog.Content>
        <Image
          source={require('../../assets/images/good.png')}
          style={{ marginTop: 'auto' }}
        />
      </Dialog.Content>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
  },
});
