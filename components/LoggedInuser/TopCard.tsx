import { Button, HStack, VStack } from '@gluestack-ui/themed';
import { StyleSheet, View } from 'react-native';
import { MyText } from '../Ui/MyText';
import { Image } from 'expo-image';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

type Props = {};

export const TopCard = ({}: Props): JSX.Element => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/edit-profile/${'1'}`);
  };
  return (
    <View>
      <View style={styles.absolute} />
      <View style={styles.topCard}>
        <HStack space="md">
          <Image
            source={{ uri: 'https://via.placeholder.com/48x48' }}
            style={{ width: 58, height: 58, borderRadius: 9999 }}
          />
          <VStack>
            <MyText fontSize={12} poppins="Bold">
              Clara Kalu
            </MyText>
            <MyText style={{ color: colors.textGray }} poppins="Light">
              Joined fidelity bank and 99 other workspaces
            </MyText>
          </VStack>
        </HStack>

        <HStack alignContent="center" justifyContent="space-between" mt={15}>
          <VStack justifyContent="center" alignItems="center">
            <MyText poppins="Medium">Owned WS</MyText>
            <MyText poppins="Bold" fontSize={14}>
              20
            </MyText>
          </VStack>
          <VStack justifyContent="center" alignItems="center">
            <MyText poppins="Medium">Assigned WS</MyText>
            <MyText poppins="Bold" fontSize={14}>
              20
            </MyText>
          </VStack>
          <Button
            style={{ backgroundColor: colors.dialPad }}
            onPress={handleNavigate}
          >
            <MyText poppins="Medium" fontSize={12} style={{ color: 'white' }}>
              Edit Profile
            </MyText>
          </Button>
        </HStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topCard: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    paddingBottom: 20,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  absolute: {
    position: 'absolute',
    top: -5,
    right: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: 'white',
    zIndex: 1,
  },
});
