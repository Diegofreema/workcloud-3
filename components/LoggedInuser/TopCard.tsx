import { Button, HStack, VStack } from '@gluestack-ui/themed';
import { StyleSheet, View } from 'react-native';
import { MyText } from '../Ui/MyText';
import { Image } from 'expo-image';
import { colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import {} from '@clerk/clerk-expo';
import { UserPreview } from '../Ui/UserPreview';
type Props = {
  id?: string;
  image?: string;
  name?: string | null;
  ownedWks?: number;
};

export const TopCard = ({ id, image, name, ownedWks }: Props): JSX.Element => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/edit-profile/${id}`);
  };
  return (
    <View>
      <View style={styles.absolute} />
      <View style={styles.topCard}>
        <UserPreview imageUrl={image} name={name} id={id} />
        <HStack alignContent="center" justifyContent="space-between" mt={15}>
          <VStack justifyContent="center" alignItems="center">
            <MyText poppins="Medium">Owned WS</MyText>
            <MyText poppins="Bold" fontSize={14}>
              {ownedWks}
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
