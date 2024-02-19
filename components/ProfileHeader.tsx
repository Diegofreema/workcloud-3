import { useUser } from '@clerk/clerk-expo';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';
type Props = {
  id: string;
};

export const ProfileHeader = ({ id }: Props): JSX.Element | undefined => {
  const { user, isLoaded } = useUser();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  if (isLoaded && !user?.id) return;
  return (
    <Link asChild href={`/(myProfile)/${id}`}>
      <Pressable
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Image
          style={styles.image}
          source={user?.imageUrl}
          contentFit="cover"
        />
        <View>
          <Text
            variant="titleSmall"
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 17,
              color: darkMode ? 'white' : 'black',
            }}
          >
            Hi {user?.firstName}
          </Text>
          <Text
            style={{
              color: '#666666',
              fontFamily: 'PoppinsLight',
            }}
          >
            Good to have you here
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
