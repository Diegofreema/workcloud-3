import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import dateFormat from 'dateformat';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FileObject } from '@supabase/storage-js';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { useFormik } from 'formik';
import Toast from 'react-native-toast-message';
import { days, defaultStyle } from '../../constants';
import { AuthHeader } from '../../components/AuthHeader';
import { AuthTitle } from '../../components/AuthTitle';
import { useDarkMode } from '../../hooks/useDarkMode';
import { colors } from '../../constants/Colors';
import { Subtitle } from '../../components/Subtitle';
import { InputComponent } from '../../components/InputComponent';
import { supabase } from '../../lib/supabase';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useData } from '@/hooks/useData';
import { createOrg } from '@/lib/helper';
import { SelectList } from 'react-native-dropdown-select-list';
import { Select } from '@gluestack-ui/themed';
const validationSchema = yup.object().shape({
  organizationName: yup.string().required('Name of organization is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  startDay: yup.string(),
  endDay: yup.string(),
  startTime: yup.string().required('Working time is required'),
  endTime: yup.string().required('Working time is required'),
  websiteUrl: yup.string().required('Website link is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

type Props = {};

const CreateWorkSpace = (props: Props) => {
  const [startTime, setStartTime] = useState(new Date(1598051730000));
  const [endTime, setEndTime] = useState(new Date(1598051730000));
  const [avatar, setAvatar] = useState<string>('https://placehold.co/100x100');
  const { id } = useData();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const queryClient = useQueryClient();

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      console.log(base64);

      setAvatar(base64);
    }
  };

  const {
    values,
    handleChange,

    handleSubmit,
    isSubmitting,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      email: '',
      organizationName: '',
      category: '',
      startDay: 'Monday',
      endDay: 'Friday',
      description: '',
      location: '',
      websiteUrl: '',
      startTime: '',
      endTime: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // @ts-ignore

      //
      const { data, error } = await supabase
        .from('organization')
        .insert({
          name: values.organizationName,
          category: values.category,
          description: values.description,
          avatar,
          ownerId: id,
          email: values.email,
          location: values.location,
          start: values.startTime,
          end: values.endTime,
          website: values.websiteUrl,
          workDays: values.startDay + ' - ' + values.endDay,
        })
        .select()
        .single();

      if (!error) {
        const { error: err } = await supabase
          .from('user')
          .update({
            organizationId: data?.id,
          })
          .eq('userId', id);
        if (!err) {
          queryClient.invalidateQueries({
            queryKey: ['organizations', 'organization'],
          });
          queryClient.invalidateQueries({
            queryKey: ['profile', id],
          });
          resetForm();
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Organization created successfully',
            position: 'top',
          });

          router.push(`/(app)/(organization)/${id}`);
        }
      }

      if (error) {
        console.log(error);

        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: "Couldn't create organization",
          position: 'bottom',
        });
      }
      return;
    },
  });

  const onChange = (event: any, selectedDate: any, type: string) => {
    const currentDate = selectedDate;
    if (type === 'startTime') {
      setShow(false);
      setStartTime(currentDate);
      setValues({ ...values, startTime: format(currentDate, 'HH:mm') });
    } else {
      setShow2(false);
      setEndTime(currentDate);
      setValues({ ...values, endTime: format(currentDate, 'HH:mm') });
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
    organizationName,
    startDay,
    description,
    websiteUrl,
  } = values;
  console.log(values);

  return (
    <ScrollView
      style={[defaultStyle, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <AuthHeader />
      <View style={{ marginBottom: 20 }} />

      <AuthTitle>Create an organization</AuthTitle>
      <Subtitle>Enter your organization details</Subtitle>
      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flex: 0.6, gap: 10 }}>
          <Text
            style={{
              color: darkMode ? 'white' : 'black',
              fontFamily: 'PoppinsMedium',
            }}
          >
            Organization image
          </Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                source={{ uri: avatar }}
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
                onPress={onSelectImage}
              >
                <FontAwesome
                  name="plus"
                  size={20}
                  color={darkMode ? 'black' : 'white'}
                />
              </TouchableOpacity>
            </View>
          </View>

          <>
            <InputComponent
              label="Organization Name"
              value={organizationName}
              onChangeText={handleChange('organizationName')}
              placeholder="Organization Name"
              keyboardType="default"
            />
            {touched.organizationName && errors.organizationName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.organizationName}
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
              autoCapitalize="none"
              label="Website Link"
              value={websiteUrl}
              onChangeText={handleChange('websiteUrl')}
              placeholder="Website link"
              keyboardType="default"
            />
            {touched.websiteUrl && errors.websiteUrl && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.websiteUrl}
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
              <Text style={{ color: 'red', fontFamily: 'PoppinsMedium' }}>
                {errors.email}
              </Text>
            )}
          </>
          <>
            <Text style={{ marginBottom: 5, fontFamily: 'PoppinsMedium' }}>
              Work Days
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                width: '100%',
              }}
            >
              <>
                <SelectList
                  search={false}
                  boxStyles={{
                    ...styles2.border,
                    width: '100%',
                  }}
                  inputStyles={{
                    textAlign: 'left',
                    fontSize: 14,
                    borderWidth: 0,
                  }}
                  fontFamily="PoppinsMedium"
                  setSelected={handleChange('startDay')}
                  data={days}
                  defaultOption={{ key: 'monday', value: 'Monday' }}
                  save="key"
                  placeholder="Select your state"
                />
              </>
              <>
                <SelectList
                  search={false}
                  boxStyles={{
                    ...styles2.border,
                    justifyContent: 'flex-start',
                    backgroundColor: '#E9E9E9',
                    width: '100%',
                  }}
                  inputStyles={{ textAlign: 'left', fontSize: 14 }}
                  fontFamily="PoppinsMedium"
                  setSelected={handleChange('endDay')}
                  data={days}
                  defaultOption={{ key: 'friday', value: 'Friday' }}
                  save="key"
                  placeholder="Select your state"
                />
              </>
            </View>
          </>
          <>
            <Text style={{ marginBottom: 5, fontFamily: 'PoppinsMedium' }}>
              Opening And Closing Time
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <>
                <Pressable onPress={showMode} style={styles2.border}>
                  <Text>
                    {' '}
                    {`${format(startTime, 'HH:mm') || ' Opening Time'}`}{' '}
                  </Text>
                </Pressable>

                {show && (
                  <DateTimePicker
                    display="spinner"
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
                  <Text>
                    {' '}
                    {`${dateFormat(endTime, 'HH:MM') || ' Closing Time'}`}{' '}
                  </Text>
                </Pressable>

                {show2 && (
                  <DateTimePicker
                    display="spinner"
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
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateWorkSpace;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 0,
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
