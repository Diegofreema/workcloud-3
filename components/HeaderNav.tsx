import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useDarkMode } from '../hooks/useDarkMode';
import { Pressable } from 'react-native';
import { VStack } from '@gluestack-ui/themed';
import { colors } from '../constants/Colors';

type Props = {
  title: string;
  RightComponent?: () => JSX.Element;
  subTitle?: string;
};

export const HeaderNav = ({
  title,
  RightComponent,
  subTitle,
}: Props): JSX.Element => {
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const onGoBack = () => {
    router.back();
  };
  return (
    <View
      style={{
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={onGoBack}
          style={{
            paddingVertical: 5,
            paddingRight: 5,
          }}
        >
          <FontAwesome
            name="angle-left"
            color={darkMode ? 'white' : 'black'}
            size={30}
          />
        </Pressable>
        <VStack>
          <Text
            style={{
              color: darkMode ? 'white' : 'black',
              fontFamily: 'PoppinsBold',
              fontSize: 15,
            }}
          >
            {title}
          </Text>

          {subTitle && (
            <Text
              style={{
                color: colors.grayText,
                fontFamily: 'PoppinsLight',
                fontSize: 8,
                marginTop: -8,
              }}
            >
              {subTitle}
            </Text>
          )}
        </VStack>
      </View>

      {RightComponent && <RightComponent />}
    </View>
  );
};

const styles = StyleSheet.create({});
