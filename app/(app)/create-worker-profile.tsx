import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AuthTitle } from '../../components/AuthTitle';
import { Button, Text } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { InputComponent } from '../../components/InputComponent';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import RNPickerSelect from 'react-native-picker-select';
import { supabase } from '../../lib/supabase';
import * as yup from 'yup';
import dateFormat from 'dateformat';
import { defaultStyle } from '../../constants';
import { AuthHeader } from '../../components/AuthHeader';
import { useDarkMode } from '../../hooks/useDarkMode';
import Toast from 'react-native-toast-message';
import { useUser } from '@clerk/clerk-expo';
import { MyText } from '@/components/Ui/MyText';
import { MyButton } from '@/components/Ui/MyButton';
import { FontAwesome } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
type Props = {};
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),

  gender: yup.string().required('Gender is required'),
  location: yup.string().required('Location is required'),
  experience: yup
    .string()
    .required('Experience is required')
    .max(100, 'Maximum 100 characters'),
  skills: yup
    .string()
    .required('Skills are required')
    .min(1, 'Minimum of 1 skill is required'),
  qualifications: yup.string().required('Qualifications are required'),
});

const max = 150;
const CreateProfile = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { isLoaded, isSignedIn, user } = useUser();
  const [image, setImage] = useState(user?.imageUrl);
  const [error, setError] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(false);
  useEffect(() => {}, [error]);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      Toast.show({
        type: 'error',
        text1: 'Unauthorized',
        text2: 'Please login to continue',
      });
      router.replace('/login');
    }
  }, []);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      email: user?.emailAddresses[0]?.emailAddress,
      password: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      location: '',
      gender: '',
      skills: '',
      imageUrl: user?.imageUrl,
      experience: '',
      userId: user?.id,
      qualifications: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        experience,
        imageUrl,
        location,
        skills,
        userId,
        firstName,
        gender,
        lastName,
        qualifications,
      } = values;
      const { error } = await supabase.from('workers').insert({
        name: `${firstName} ${lastName}`,
        userId,
        gender,
        imageUrl: user?.imageUrl,
        location,
        skill: skills,
        exp: experience,
        email: values.email,
        qualification: qualifications,
      });
      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Welcome to Workcloud',
          text2: `${firstName} your work profile was created`,
        });
        queryClient.invalidateQueries({ queryKey: ['workers'] });
        resetForm();
        router.push('/(tabs)/workspace');
      }

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later',
        });

        console.log(error);
      }
    },
  });
  const {
    firstName,
    gender,
    lastName,
    location,
    experience,
    skills,
    qualifications,
  } = values;
  useEffect(() => {
    if (experience.length > 150) {
      setValues({ ...values, experience: experience.substring(0, 150) });
    }
  }, [experience]);
  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;

      setImage(base64);
    }
  };

  const onUpdateImage = async () => {
    setUpdatingImage(true);
    if (!image?.includes('data:image/png;base64')) return;
    try {
      await user?.setProfileImage({
        file: image,
      });
      Toast.show({
        type: 'success',
        text1: 'Image has been updated',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Try again later',
      });
    } finally {
      setUpdatingImage(false);
    }
  };
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...defaultStyle, paddingBottom: 50 }}
    >
      <AuthHeader />
      <View style={{ marginBottom: 10 }} />
      <AuthTitle>Set up your profile to work on workcloud</AuthTitle>
      <MyText
        poppins="Light"
        fontSize={15}
        style={{ marginTop: 20, color: colors.textGray }}
      >
        Enter your details below
      </MyText>
      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flex: 0.6, gap: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <View>
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 9999 }}
              />
              <Pressable
                onPress={onSelectImage}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1 },
                  {
                    position: 'absolute',
                    bottom: 2,
                    right: 5,
                    padding: 5,
                    borderRadius: 9999,
                    backgroundColor: 'white',
                  },
                ]}
              >
                <FontAwesome name="plus-circle" size={20} color={'black'} />
              </Pressable>
            </View>

            <MyButton
              onPress={onUpdateImage}
              loading={updatingImage}
              style={{ marginTop: 10 }}
            >
              Change image
            </MyButton>
          </View>
          <>
            <InputComponent
              label="First Name"
              value={firstName}
              onChangeText={handleChange('firstName')}
              placeholder="First Name"
              keyboardType="default"
            />
            {touched.firstName && errors.firstName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.firstName}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Last Name"
              value={lastName}
              onChangeText={handleChange('lastName')}
              placeholder="Last Name"
              keyboardType="default"
            />
            {touched.lastName && errors.lastName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.lastName}
              </Text>
            )}
          </>

          <>
            <InputComponent
              label="Experience"
              value={experience}
              onChangeText={handleChange('experience')}
              placeholder="Write about your past work experience..."
              keyboardType="default"
              numberOfLines={5}
              multiline
            />
            <MyText poppins="Medium" fontSize={15}>
              {experience.length}/{max}
            </MyText>
            {touched.experience && errors.experience && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.experience}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Qualifications"
              value={qualifications}
              onChangeText={handleChange('qualifications')}
              placeholder="Bsc. Computer Science, Msc. Computer Science"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />

            {touched.qualifications && errors.qualifications && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.qualifications}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Skills"
              value={skills}
              onChangeText={handleChange('skills')}
              placeholder="e.g Customer service, marketing, sales"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />
            {touched.skills && errors.skills && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.skills}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Location"
              value={location}
              onChangeText={handleChange('location')}
              placeholder="Where do you reside?"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />
            {touched.location && errors.location && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.location}
              </Text>
            )}
          </>
          <>
            <Text
              style={{
                color: darkMode ? colors.white : colors.black,
                fontWeight: 'bold',
              }}
            >
              Gender
            </Text>
            <View style={styles2.border}>
              <RNPickerSelect
                value={gender}
                onValueChange={handleChange('gender')}
                items={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                style={styles}
              />
            </View>
            {touched.gender && errors.gender && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.gender}
              </Text>
            )}
          </>
        </View>
        <View style={{ flex: 0.4, marginTop: 30 }}>
          <Button
            loading={isSubmitting}
            mode="contained"
            onPress={() => handleSubmit()}
            buttonColor={colors.buttonBlue}
            textColor="white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateProfile;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
});
const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'PoppinsMedium',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'PoppinsMedium',
  },
});
