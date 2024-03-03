import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import dateFormat from 'dateformat';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FileObject } from '@supabase/storage-js';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-paper';
import { useFormik } from 'formik';
import { useAuth, useUser } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';
import DocumentPicker, {
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { supabase } from '../../../lib/supabase';
import { days, defaultStyle } from '../../../constants';
import { AuthHeader } from '../../../components/AuthHeader';
import { AuthTitle } from '../../../components/AuthTitle';
import { InputComponent } from '../../../components/InputComponent';
import { colors } from '../../../constants/Colors';
import { Organization } from '../../../constants/types';
const validationSchema = yup.object().shape({
  organization_name: yup.string().required('Name of organization is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  startDay: yup.string().required('Working days are required'),
  endDay: yup.string().required('Working days are required'),

  website_url: yup.string().required('Website link is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

type Props = {};

const Edit = (props: Props) => {
  const [startTime, setStartTime] = useState(new Date(1598051730000));
  const [endTime, setEndTime] = useState(new Date(1598051730000));
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState<ArrayBuffer>();
  const [imageType, setImageType] = useState('');
  const [image, setImage] = useState<string>('');
  console.log('🚀 ~ Edit ~ image:', image);
  const { isLoaded, isSignedIn, user } = useUser();
  const { editId } = useLocalSearchParams();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const [file, setFile] = useState<FileObject[]>([]);
  const queryClient = useQueryClient();
  const id = editId as string;
  useEffect(() => {
    loadImage(imagePath);
  }, [imagePath, imageName, imageType]);
  const loadImage = async (filePath: any) => {
    const { data } = supabase.storage
      .from('organizations')
      .getPublicUrl(`${imagePath}/${imageName}.${imageType}`);
    const finalImageUrl = data.publicUrl.split('/').slice(0, -1).join('/');

    setImage(finalImageUrl);
  };
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      Toast.show({
        type: 'error',
        text1: 'Unauthorized',
        text2: 'Please login to continue',
      });
      router.push('/login');
      return;
    }
  }, []);

  useEffect(() => {
    const checkIfBoarded = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('user_id')
        .eq('user_id', user?.id);
      console.log(data);

      if (isSignedIn && !data?.length) {
        router.push('/board');
        return Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'Please complete your profile to continue',
        });
      }
    };
    checkIfBoarded();
  }, []);

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0];

      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: 'base64',
      });
      const filePath = `${Math.random()}/${new Date().getTime()}.${
        img.type === 'image' ? 'png' : 'mp4'
      }`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';

      const { error } = await supabase.storage
        .from('organizations')
        .upload(filePath, decode(base64), { contentType });
      setImagePath(filePath);
      setImageName(decode(base64));
      setImageType(contentType);
      loadImage(filePath);
      if (error) {
        console.log(error);
      }
    }
  };

  const onRemove = async () => {
    const { data, error } = await supabase.storage
      .from('organizations')
      .remove([`${imagePath}/${imageName}.${imageType}`]);
    setImage('');
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      email: '',
      organization_name: '',
      category: '',
      startDay: '',
      endDay: '',
      description: '',
      location: '',
      website_url: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        email,
        category,
        endDay,
        location,
        organization_name,
        startDay,
        description,
        website_url,
      } = values;

      if (!image.includes('png') && !image.includes('jpg')) {
        return Toast.show({
          type: 'error',
          text1: 'Please upload an image',
        });
      }
      const { error } = await supabase
        .from('workspace')
        .update({
          organization_name: organization_name,
          category,
          description,
          email,
          closing_time: endTime,
          work_days: `${startDay} - ${endDay}`,
          website: website_url,
          location,
          opening_time: startTime,
          owner_id: user?.id,
          image_url: image.includes('ArrayBuffer')
            ? image.split('/').slice(0, -1).join('/')
            : image,
        })
        .eq('id', id.replace(')', ''));

      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Organization updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
        router.push('/workspace');
        return;
      }
      if (error) {
        console.log(error);

        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      }
    },
  });
  useEffect(() => {
    const getWorkspace = async () => {
      const { data, error } = await supabase
        .from('workspace')
        .select()
        .eq('id', id.replace(')', ''));
      console.log(id);

      if (error) {
        return console.log(error);
      }

      console.log(data);
      const orgs: Organization = data[0];
      setValues({
        category: orgs.category,
        description: orgs.description,
        email: orgs.email,
        organization_name: orgs.organization_name,
        location: orgs.location,
        website_url: orgs.website,
        endDay: orgs.work_days.split(' - ')[1],
        startDay: orgs.work_days.split(' - ')[0],
      });
      setStartTime(new Date(orgs.opening_time));
      setEndTime(new Date(orgs.closing_time));
      setImage(orgs.image_url);
    };
    getWorkspace();
  }, []);
  console.log(image);

  const onChange = (event: any, selectedDate: any, type: string) => {
    const currentDate = selectedDate;
    if (type === 'startTime') {
      setShow(false);
      setStartTime(currentDate);
    } else {
      setShow2(false);
      setEndTime(currentDate);
    }
  };
  const showMode = () => {
    setShow(true);
  };
  const showMode2 = () => {
    setShow2(true);
  };
  const {
    email,
    category,
    endDay,
    location,
    organization_name,
    startDay,
    description,
    website_url,
  } = values;
  const imgUrl = image.includes('ArrayBuffer')
    ? image.split('/').slice(0, -1).join('/')
    : image;
  return (
    <ScrollView
      style={[defaultStyle, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <AuthHeader path="Edit Organization" />

      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flex: 0.6, gap: 10 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {image.includes('png') || image.includes('jpg') ? (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              >
                <Image
                  contentFit="cover"
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={imgUrl}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 3,
                    backgroundColor: darkMode ? 'white' : 'black',
                    padding: 5,
                    borderRadius: 30,
                  }}
                  onPress={onRemove}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={darkMode ? 'black' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,

                  backgroundColor: 'gray',
                }}
              >
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 3,
                    backgroundColor: darkMode ? 'white' : 'black',
                    padding: 5,
                    borderRadius: 30,
                  }}
                  onPress={onSelectImage}
                >
                  <FontAwesome
                    name="plus"
                    size={20}
                    color={darkMode ? 'black' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <>
            <InputComponent
              label="Organization Name"
              value={organization_name}
              onChangeText={handleChange('organization_name')}
              placeholder="Organization Name"
              keyboardType="default"
            />
            {touched.organization_name && errors.organization_name && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.organization_name}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Description"
              value={description}
              onChangeText={handleChange('description')}
              placeholder="Description"
              keyboardType="default"
              numberOfLines={5}
            />
            {touched.description && errors.description && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.description}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Category"
              value={category}
              onChangeText={handleChange('category')}
              placeholder="Category"
              keyboardType="default"
            />
            {touched.category && errors.category && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.category}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Location"
              value={location}
              onChangeText={handleChange('location')}
              placeholder="Location"
              keyboardType="default"
            />
            {touched.location && errors.location && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.location}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Website Link"
              value={website_url}
              onChangeText={handleChange('website_url')}
              placeholder="Website link"
              keyboardType="default"
            />
            {touched.website_url && errors.website_url && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.website_url}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Email"
              value={email}
              onChangeText={handleChange('email')}
              placeholder="Email"
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.email}
              </Text>
            )}
          </>
          <>
            <Text
              style={{
                marginBottom: 5,
                fontFamily: 'PoppinsBold',
                fontSize: 12,
              }}
            >
              Work Days
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <>
                <View style={styles2.border}>
                  <RNPickerSelect
                    value={startDay}
                    onValueChange={handleChange('startDay')}
                    items={days}
                    style={styles}
                  />
                </View>
                {touched.startDay && errors.startDay && (
                  <Text
                    style={{
                      color: 'red',

                      fontFamily: 'PoppinsBold',
                      fontSize: 12,
                    }}
                  >
                    {errors.startDay}
                  </Text>
                )}
              </>
              <>
                <View style={styles2.border}>
                  <RNPickerSelect
                    value={endDay}
                    onValueChange={handleChange('endDay')}
                    items={days}
                    style={styles}
                  />
                </View>
                {touched.endDay && errors.endDay && (
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>
                    {errors.endDay}
                  </Text>
                )}
              </>
            </View>
          </>
          <>
            <Text
              style={{
                marginBottom: 5,

                fontFamily: 'PoppinsBold',
                fontSize: 12,
              }}
            >
              Opening And Closing Time
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <>
                <Pressable onPress={showMode} style={styles2.border}>
                  <Text style={{ fontFamily: 'PoppinsLight', fontSize: 12 }}>
                    {' '}
                    {`${
                      dateFormat(startTime, 'HH:MM') || ' Opening Time'
                    }`}{' '}
                  </Text>
                </Pressable>
                {/* {touched.date && errors.date && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.date}
              </Text>
            )} */}

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startTime}
                    mode={'time'}
                    is24Hour={true}
                    onChange={(event, selectedDate) =>
                      onChange(event, selectedDate, 'startTime')
                    }
                  />
                )}
              </>
              <>
                <Pressable onPress={showMode2} style={styles2.border}>
                  <Text style={{ fontFamily: 'PoppinsLight', fontSize: 12 }}>
                    {' '}
                    {`${dateFormat(endTime, 'HH:MM') || ' Closing Time'}`}{' '}
                  </Text>
                </Pressable>
                {/* {touched.date && errors.date && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.date}
              </Text>
            )} */}
                {show2 && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endTime}
                    mode={'time'}
                    is24Hour={true}
                    onChange={(event, selectedDate) =>
                      onChange(event, selectedDate, 'endTime')
                    }
                  />
                )}
              </>
            </View>
          </>
        </View>
        <View style={{ flex: 0.4, marginTop: 30 }}>
          <Button
            loading={isSubmitting}
            mode="contained"
            onPress={() => handleSubmit()}
            buttonColor={colors.buttonBlue}
            textColor={colors.white}
            labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Edit;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    width: '50%',
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
  },
});
