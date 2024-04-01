import { Button, HStack, VStack } from '@gluestack-ui/themed';
import { Pressable, StyleSheet, View } from 'react-native';
import { MyText } from '../Ui/MyText';
import { Image } from 'expo-image';
import { colors } from '../../constants/Colors';
import { Link, useRouter } from 'expo-router';
import {} from '@clerk/clerk-expo';
import { UserPreview } from '../Ui/UserPreview';
import { useData } from '@/hooks/useData';
import { MyButton } from '../Ui/MyButton';
type Props = {
  id?: string;
  image?: string;
  name?: string | null;
  ownedWks?: number;
};

export const TopCard = ({ image, name, ownedWks }: Props): JSX.Element => {
  const router = useRouter();
  const { id } = useData();
  const handleNavigate = () => {
    router.push(`/edit-profile/${id}`);
    console.log('pressed');
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
          <Link href="/edit-profile" asChild>
            <Pressable
              style={{
                backgroundColor: colors.dialPad,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <MyText poppins="Medium" fontSize={12} style={{ color: 'white' }}>
                Edit Profile
              </MyText>
            </Pressable>
          </Link>
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
