import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth, useSignUp, useUser } from '@clerk/clerk-expo';
import { InputComponent } from '@/components/InputComponent';
import { Center, VStack } from '@gluestack-ui/themed';
import { AuthTitle } from '@/components/AuthTitle';
import { colors } from '@/constants/Colors';
import { MyButton } from '@/components/Ui/MyButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
import { useRouter } from 'expo-router';
import OTPTextView from 'react-native-otp-textinput';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import Clipboard from '@react-native-clipboard/clipboard';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emailAddress: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const input = useRef<OTPTextView>(null);
  const { user } = useUser();
  const router = useRouter();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [id, setId] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/100x100');
  const [startTimer, setStartTimer] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [seconds, setSeconds] = useState(60);
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
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      const { emailAddress, firstName, lastName, password } = values;
      try {
        const { data } = await axios.post(
          'http://192.168.240.212:3000/auth/create',
          {
            email: emailAddress.toLowerCase(),
            name: `${firstName} ${lastName}`,
            password: password,
            avatar: imageUrl,
          }
        );
        console.log(data);
        if (data?.user?.id) {
          setId(data?.user?.id);

          setPendingVerification(true);
          Toast.show({
            type: 'success',
            text1: 'Please check your email',
            text2: 'A verification code has been sent ' + emailAddress,
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error?.response?.data.error,
        });
        console.log(error, 'Error');
      }
    },
  });
  const { emailAddress, firstName, lastName, password, confirmPassword } =
    values;
  console.log(id);

  const setOtpInput = (text: any) => {
    setCode(text);
  };

  console.log(code);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTimer) {
      timer = setInterval(() => {
        setSeconds((prevCount) => {
          if (prevCount === 0) {
            setStartTimer(false);
            return prevCount;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [startTimer]);
  const onPressVerify = async () => {
    setVerifyingCode(true);
    try {
      const { data } = await axios.post(
        'http://192.168.240.212:3000/auth/verify-email',
        {
          token: code,
          userId: id,
        }
      );
      if (data.message === 'Your email has been verified!') {
        Toast.show({
          type: 'success',
          text1: 'Email verified',
          text2: 'Welcome to workcloud',
        });
        setPendingVerification(false);
        setVerified(true);
        router.push('/');
      }
      console.log(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error, something went wrong',
        text2: error?.response?.data.error,
      });
      console.log(error);
    } finally {
      setPendingVerification(false);
      setVerifyingCode(false);
    }
  };

  const resendOtp = async () => {
    setResendingOtp(true);
    setStartTimer(true);
    try {
      const { data } = await axios.post(
        'http://192.168.240.212:3000/auth/re-verify-email',
        {
          userId: id,
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Token has been resent',
        text2: data.message,
      });
      console.log(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error, something went wrong',
        text2: error?.response?.data.error,
      });
      console.log(error);
    } finally {
      setResendingOtp(false);
    }
  };
  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      // console.log(result);

      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      setImageUrl(base64);
    }
  };
  return (
    <ScrollView
      style={{ paddingHorizontal: 20, flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {!pendingVerification && (
        <VStack gap={20} flex={1}>
          <VStack gap={5} mt={40}>
            <AuthTitle>Create account</AuthTitle>
            <Text
              style={{
                marginTop: 20,

                color: colors.textGray,
                fontFamily: 'PoppinsBold',
                fontSize: 13,
              }}
            >
              Enter a valid email address either company email or personal email
              to create an account
            </Text>
          </VStack>
          <Center>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
              />
              <Pressable
                onPress={onSelectImage}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 },
                  styles.absolute,
                ]}
              >
                <FontAwesome name="plus" color="white" size={20} />
              </Pressable>
            </View>
          </Center>
          <SemiContainer>
            <InputComponent
              autoCapitalize="none"
              value={firstName}
              placeholder="First Name..."
              onChangeText={handleChange('firstName')}
            />
            {touched.firstName && errors.firstName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.firstName}
              </Text>
            )}
          </SemiContainer>
          <SemiContainer>
            <InputComponent
              autoCapitalize="none"
              value={lastName}
              placeholder="Last Name..."
              onChangeText={handleChange('lastName')}
            />
            {touched.lastName && errors.lastName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.lastName}
              </Text>
            )}
          </SemiContainer>
          <SemiContainer>
            <InputComponent
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={handleChange('emailAddress')}
            />
            {touched.emailAddress && errors.emailAddress && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.emailAddress}
              </Text>
            )}
          </SemiContainer>

          <SemiContainer>
            <InputComponent
              value={password}
              placeholder="Password..."
              placeholderTextColor="#000"
              secureTextEntry={true}
              onChangeText={handleChange('password')}
            />
            {touched.password && errors.password && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.password}
              </Text>
            )}
          </SemiContainer>
          <SemiContainer>
            <InputComponent
              value={confirmPassword}
              placeholder="Confirm password..."
              placeholderTextColor="#000"
              secureTextEntry={true}
              onChangeText={handleChange('confirmPassword')}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.confirmPassword}
              </Text>
            )}
          </SemiContainer>
          {/* <SemiContainer>
            <SelectList
              search={false}
              boxStyles={{
                ...styles2.border,
                justifyContent: 'flex-start',
                backgroundColor: '#E9E9E9',
              }}
              inputStyles={{ textAlign: 'left', fontSize: 14 }}
              fontFamily="PoppinsMedium"
              setSelected={handleChange('gender')}
              data={[
                {
                  key: 'male',
                  value: 'Male',
                },
                {
                  key: 'female',
                  value: 'Female',
                },
              ]}
              defaultOption={{ key: 'male', value: 'Male' }}
              save="key"
              placeholder="Select your state"
            />
          </SemiContainer> */}
          <View style={{ marginTop: 'auto', marginBottom: 100 }}>
            <MyButton loading={isSubmitting} onPress={() => handleSubmit()}>
              Create account
            </MyButton>
          </View>
        </VStack>
      )}
      {pendingVerification && (
        <VStack flex={1} mb={20}>
          <VStack gap={5} mt={40}>
            <AuthTitle>Check your email</AuthTitle>
            <Text
              style={{
                marginTop: 20,
                color: colors.textGray,
                fontFamily: 'PoppinsBold',
                fontSize: 13,
              }}
            >
              {` Please enter the verification code sent to ${emailAddress}`}
            </Text>
          </VStack>
          <View style={{ marginTop: 20 }}>
            <OTPTextView
              ref={input}
              textInputStyle={styles.textInputStyle}
              handleTextChange={setOtpInput}
              // handleCellTextChange={handleCellTextChange}
              inputCount={5}
              keyboardType="numeric"
              tintColor={colors.dialPad}
              offTintColor={colors.dialPad}
              containerStyle={{
                borderWidth: 0,
              }}
            />
          </View>
          <VStack gap={6} my={20}>
            <Text style={{ textAlign: 'center', fontFamily: 'PoppinsMedium' }}>
              Didn’t receive the code?{' '}
            </Text>
            <MyButton
              disabled={resendingOtp || startTimer}
              onPress={resendOtp}
              buttonColor="transparent"
              textColor={colors.dialPad}
            >
              Resend
            </MyButton>
            {startTimer && (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'PoppinsMedium',
                  color: 'black',
                }}
              >
                You can resend in {seconds}
              </Text>
            )}
          </VStack>
          <View style={{ marginTop: 'auto', marginBottom: 100 }}>
            <MyButton loading={verifyingCode} onPress={onPressVerify}>
              Verify
            </MyButton>
          </View>
        </VStack>
      )}
    </ScrollView>
  );
}

const styles2 = StyleSheet.create({
  border: {
    borderWidth: 0,
    borderColor: 'black',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderRadius: 0,
    minHeight: 57,

    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.grayText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
const styles = StyleSheet.create({
  textInputStyle: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 4,
    width: 30,
    height: 55,
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  absolute: {
    position: 'absolute',
    right: 5,
    bottom: 10,
    zIndex: 99,
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const SemiContainer = ({ children }: { children: React.ReactNode }) => {
  return <VStack gap={10}>{children}</VStack>;
};
