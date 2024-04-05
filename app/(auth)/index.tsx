// import React from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
// import { useWarmUpBrowser } from '../../hooks/warmUpBrowser';
// import { Button, Text } from 'react-native-paper';
// import { Redirect, useRouter } from 'expo-router';
// import { colors } from '../../constants/Colors';
// import { AuthTitle } from '../../components/AuthTitle';
// import { View } from 'react-native';
// import { useDarkMode } from '../../hooks/useDarkMode';

// import { Container } from '@/components/Ui/Container';
// import axios from 'axios';
// import { useQueryClient } from '@tanstack/react-query';
// import { useData } from '@/hooks/useData';
// WebBrowser.maybeCompleteAuthSession();

// const SignInWithOAuth = () => {
//   const { darkMode } = useDarkMode();
//   const { user } = useUser();
//   const queryClient = useQueryClient();
//   const { getUserData } = useData();

//   console.log('🚀 ~ SignInWithOAuth ~ user:', user);
//   useWarmUpBrowser();
//   const router = useRouter();

//   const createProfile = async () => {
//     try {
//       const { data } = await axios.post(
//         'https://server-zeta-blush.vercel.app/create-profile',
//         {
//           email: user?.emailAddresses[0].emailAddress,
//           name: user?.fullName,
//           avatarUrl: user?.imageUrl,
//           user_id: user?.id,
//         }
//       );
//       getUserData(data);

//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

//   const onPress = async () => {
//     try {
//       const { createdSessionId, setActive } = await startOAuthFlow();

//       if (createdSessionId) {
//         console.log('🚀 ~ onPress ~ createdSessionId:', createdSessionId);
//         setActive!({ session: createdSessionId });
//         createProfile();
//         return router.replace('/home');
//       }
//     } catch (err) {
//       console.error('OAuth error', err);
//     }
//   };

//   return (
//     <Container>
//       <View style={{ marginTop: 50 }}>
//         <AuthTitle>Welcome, Login to continue</AuthTitle>
//         <Text
//           style={{
//             marginTop: 20,

//             color: darkMode ? 'white' : colors.textGray,
//             fontFamily: 'PoppinsBold',
//           }}
//         >
//           Login to continue accessing organizations
//         </Text>
//         <View style={{ marginTop: 30 }}>
//           <Button
//             mode="contained"
//             onPress={onPress}
//             buttonColor={colors.buttonBlue}
//             textColor="white"
//             contentStyle={{
//               height: 50,
//               borderRadius: 10,
//               flexDirection: 'row-reverse',
//             }}
//             icon={'google'}
//             uppercase
//             rippleColor={'#000'}
//             labelStyle={{
//               fontFamily: 'PoppinsMedium',
//             }}
//           >
//             Sign in with
//           </Button>
//         </View>
//       </View>
//     </Container>
//   );
// };
// export default SignInWithOAuth;

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AuthTitle } from '@/components/AuthTitle';
import { colors } from '@/constants/Colors';
import { InputComponent } from '@/components/InputComponent';
import { VStack } from '@gluestack-ui/themed';
import { MyButton } from '@/components/Ui/MyButton';
import { Link, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useData } from '@/hooks/useData';
import { Button } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

const validationSchema = yup.object().shape({
  emailAddress: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
export default function SignInScreen() {
  const { getUserId, user, id } = useData();
  const router = useRouter();

  const {
    errors,
    handleChange,
    handleSubmit,
    touched,
    setValues,
    resetForm,
    values,
    isSubmitting,
  } = useFormik({
    initialValues: {
      emailAddress: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { emailAddress, password } = values;
      console.log({ emailAddress, password });

      try {
        const { data } = await axios.post(
          'https://workserver-plum.vercel.app/auth/sign-in',
          {
            email: emailAddress,
            password,
          }
        );
        console.log(data.user);

        if (data?.user) {
          getUserId(data?.user);
          router.replace('/home');
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'An error occurred',
          text2: error.response.data.error,
        });
        return console.log(error);
      }
    },
  });

  const { emailAddress, password } = values;
  return (
    <ScrollView
      style={{ paddingHorizontal: 20, flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginTop: 40 }}>
        <AuthTitle>Welcome, Login to continue</AuthTitle>
      </View>
      <Text
        style={{
          marginTop: 20,

          color: colors.textGray,
          fontFamily: 'PoppinsBold',
          fontSize: 13,
        }}
      >
        Login to continue accessing organizations
      </Text>
      <VStack gap={20} mb={40}>
        <VStack gap={10} style={{ marginTop: 20 }}>
          <InputComponent
            placeholder="Email"
            value={emailAddress}
            onChangeText={handleChange('emailAddress')}
          />
          {touched.emailAddress && errors.emailAddress && (
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
              {errors.emailAddress}
            </Text>
          )}
        </VStack>

        <VStack gap={10}>
          <InputComponent
            placeholder="Password"
            value={password}
            onChangeText={handleChange('password')}
            secureTextEntry={true}
          />
          {touched.password && errors.password && (
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
              {errors.password}
            </Text>
          )}
        </VStack>
      </VStack>

      <View
        style={{
          marginTop: 'auto',
          marginBottom: 50,
          gap: 10,
        }}
      >
        <Button
          icon={
            isSubmitting && (
              <ActivityIndicator
                style={{ marginRight: 10 }}
                size={20}
                color="white"
              />
            )
          }
          titleStyle={{ fontFamily: 'PoppinsMedium' }}
          buttonStyle={{
            backgroundColor: colors.dialPad,
            borderRadius: 5,
          }}
          onPress={() => handleSubmit()}
        >
          Sign in
        </Button>

        <Link href={'/signUp'} asChild style={{ alignItems: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'PoppinsMedium',
            }}
          >
            Don’t have an account?
            <Text style={{ color: colors.dialPad }}>Sign up</Text>
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
