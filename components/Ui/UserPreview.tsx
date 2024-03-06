import { Workers } from '@/constants/types';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { MyText } from './MyText';

type PreviewWorker = {
  imageUrl: string;
  name: string;
  subText?: string;
  id?: number;
  navigate?: boolean;
  roleText?: string;
  workspaceId?: string | null;
  personal?: boolean;
};
export const UserPreview = ({
  id,
  imageUrl,
  subText,
  navigate,
  name,
  roleText,
  workspaceId,
  personal,
}: PreviewWorker) => {
  const router = useRouter();
  const onPress = () => {
    if (!navigate) return;
    router.push(`/workerProfile/${id}`);
  };
  return (
    <Pressable onPress={onPress}>
      <HStack gap={10} alignItems="center">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 60, height: 60, borderRadius: 9999 }}
          contentFit="cover"
        />
        <VStack>
          <MyText poppins="Bold" fontSize={16}>
            {name}
          </MyText>
          {subText && (
            <MyText poppins="Medium" fontSize={14}>
              {subText}
            </MyText>
          )}
          {roleText && (
            <MyText poppins="Medium" fontSize={14}>
              {roleText} at somewhere
            </MyText>
          )}
          {!workspaceId && personal && (
            <MyText style={{ width: '90%' }} poppins="Medium" fontSize={14}>
              Currently not with any organizations
            </MyText>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
};
