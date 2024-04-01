import { Workers } from '@/constants/types';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { MyText } from './MyText';
import organizations from '../../app/(app)/(organization)/organizations';
import { colors } from '@/constants/Colors';

type PreviewWorker = {
  name: any;
  imageUrl?: string;

  subText?: string | boolean;
  id?: any;
  navigate?: boolean;
  roleText?: string;
  workspaceId?: string | null;
  personal?: boolean;
  hide?: boolean;
  workPlace?: string;
  profile?: boolean;
  active?: boolean;
  workspace?: boolean;
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
  hide,
  workPlace,
  profile,
  active,
  workspace,
}: PreviewWorker) => {
  const router = useRouter();
  const onPress = () => {
    if (!navigate) return;
    router.push(`/workerProfile/${id}`);
  };
  console.log(id);

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
              {subText === true ? 'pending' : subText}
            </MyText>
          )}
          {roleText && (
            <MyText poppins="Medium" fontSize={14}>
              {roleText} at {workPlace}
            </MyText>
          )}

          {!roleText && profile && (
            <MyText poppins="Medium" fontSize={14}>
              Currently not with an organization
            </MyText>
          )}
          {active && workspace && (
            <View
              style={{
                backgroundColor: colors.openTextColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MyText
                poppins="Medium"
                fontSize={14}
                style={{ color: colors.openBackgroundColor }}
              >
                Active
              </MyText>
            </View>
          )}

          {!active && workspace && (
            <View
              style={{
                backgroundColor: colors.closeTextColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MyText
                style={{ color: colors.closeBackgroundColor }}
                poppins="Medium"
                fontSize={14}
              >
                Inactive
              </MyText>
            </View>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
};

export const WorkPreview = ({
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
    router.push(`/singleRequest/${id}`);
  };
  console.log(id);

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
              {subText === true && 'pending'}
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
