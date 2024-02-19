import { HStack } from '@gluestack-ui/themed';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { HeadingText } from '../Ui/HeadingText';
import { useRouter } from 'expo-router';

const fourItems = [1, 2, 3, 4];
export const MiddleCard = (): JSX.Element => {
  const router = useRouter();
  const navigate = () => {
    router.push(`/orgs/${6}`);
  };
  return (
    <View>
      <HeadingText link="/connections" />

      <HStack justifyContent="space-between" mt="$2">
        {fourItems.map((item, index) => (
          <Pressable key={index} onPress={navigate}>
            <Image
              key={index}
              source={{ uri: 'https://via.placeholder.com/48x48' }}
              style={{ width: 58, height: 58, borderRadius: 9999 }}
            />
          </Pressable>
        ))}
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({});
