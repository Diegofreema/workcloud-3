import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';

import { HeadingText } from '../Ui/HeadingText';
import { router, useLocalSearchParams } from 'expo-router';
import { MyText } from '../Ui/MyText';
import { colors } from '../../constants/Colors';
import { VideoPreview } from '../Ui/VideoPreview';
import { useAuth } from '@clerk/clerk-expo';

type Props = {};
export const call = {
  time: '20 min ago',
  from: 'Called on fidelity WS',
  name: 'Roland Gracias',
};

const fourItems = [1, 2, 3];
export const BottomCard = ({}: Props): JSX.Element => {
  const { records } = useLocalSearchParams();
  const { signOut } = useAuth();
  const handleNavigate = () => {
    router.push('/settings');
  };

  const logout = () => {
    signOut();
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeadingText
        leftText="Call Records"
        rightText="See all call records"
        link={`/calls/${records}`}
      />

      <HStack
        alignItems="center"
        justifyContent="space-between"
        style={{ flexWrap: 'wrap', marginTop: 10 }}
      >
        {fourItems.map((item, index) => (
          <VideoPreview key={index} {...call} />
        ))}
      </HStack>

      <VStack mt={20}>
        <Pressable onPress={handleNavigate}>
          <HStack space="sm">
            <Image
              source={require('../../assets/images/settings.png')}
              style={{ width: 18, height: 18 }}
            />
            <VStack>
              <MyText poppins="Medium" fontSize={12}>
                Settings
              </MyText>
              <MyText poppins="Light" fontSize={9}>
                Change password, Email address
              </MyText>
            </VStack>
          </HStack>
        </Pressable>

        <Pressable
          onPress={logout}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <HStack space="sm" mt={20} alignItems="center">
            <Image
              source={require('../../assets/images/exit.png')}
              style={{ width: 25, height: 25 }}
            />
            <MyText poppins="Medium" fontSize={13}>
              Logout
            </MyText>
          </HStack>
        </Pressable>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
});
