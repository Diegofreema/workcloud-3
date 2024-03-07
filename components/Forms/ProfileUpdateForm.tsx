import { EvilIcons } from '@expo/vector-icons';
import { Button, Center, HStack, VStack } from '@gluestack-ui/themed';
import PhoneInput from 'react-native-phone-input';
import { Image } from 'expo-image';
import { SelectList } from 'react-native-dropdown-select-list';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MyText } from '../Ui/MyText';
import { InputComponent } from '../InputComponent';
import { colors } from '../../constants/Colors';
import { MyButton } from '../Ui/MyButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSaved } from '../../hooks/useSaved';
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});
export const ProfileUpdateForm = (): JSX.Element => {
  const phoneInputRef = useRef<PhoneInput>(null);
  const { onOpen } = useSaved();
  const {
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    resetForm,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: 'male',
      date_of_birth: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: () => {
      setLoading(true);
      console.log(values);
      phoneInputRef.current?.setValue(values.phoneNumber);
      resetForm();
      setLoading(false);
      onOpen();
    },
  });
  const [imgUrl, setImgUrl] = useState('https://via.placeholder.com/48x48');
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showPicker, setShowPicker] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImgUrl(result.assets[0].uri);
    } else {
      console.log('User cancelled image picker');
    }
  };

  const onHideDatePicker = () => {
    setShowPicker(false);
  };

  const onShowDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate: any) => {
    if (event.type === 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        setDateOfBirth(currentDate.toISOString().split('T')[0]);
        setFieldValue('date_of_birth', currentDate.toISOString().split('T')[0]);
        onHideDatePicker();
      }
    }
  };

  const onConfirmIos = () => {
    setDateOfBirth(inputDate?.toISOString().split('T')[0] || '');
    setFieldValue('date_of_birth', dateOfBirth);
    onHideDatePicker();
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Center>
        <View>
          <Image
            source={{ uri: imgUrl }}
            style={{ width: 58, height: 58, borderRadius: 9999, marginTop: 20 }}
          />

          <EvilIcons
            onPress={pickImageAsync}
            name="camera"
            size={14}
            color="black"
            style={styles.camera}
          />
        </View>
      </Center>
      <View style={{ marginTop: 50 }}>
        <MyText style={{ marginBottom: 10 }} poppins="Bold" fontSize={14}>
          User information
        </MyText>

        <VStack gap={10}>
          <>
            <InputComponent
              label="First Name"
              onChangeText={handleChange('firstName')}
              placeholder="First Name"
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.firstName}
              </MyText>
            )}
          </>
          <>
            <InputComponent
              label="Last Name"
              onChangeText={handleChange('lastName')}
              placeholder="Last Name"
              value={values.lastName}
            />
            {touched.lastName && errors.lastName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.lastName}
              </MyText>
            )}
          </>
          <>
            <InputComponent
              label="Email"
              onChangeText={handleChange('email')}
              placeholder="Email"
              value={values.email}
            />
            {touched.email && errors.email && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.email}
              </MyText>
            )}
          </>

          <>
            <MyText
              style={{
                marginBottom: 5,

                fontSize: 11,
              }}
              poppins="Medium"
            >
              Phone number
            </MyText>
            <PhoneInput
              ref={phoneInputRef}
              initialValue={values.phoneNumber}
              initialCountry="ng"
              textProps={{
                placeholder: 'Enter a phone number...',
              }}
              onChangePhoneNumber={handleChange('phoneNumber')}
              style={styles.phone}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.phoneNumber}
              </MyText>
            )}
          </>
          <>
            <MyText
              style={{
                marginBottom: 5,

                fontSize: 11,
              }}
              poppins="Medium"
            >
              Gender
            </MyText>
            <SelectList
              placeholder="Select your community"
              boxStyles={{
                ...styles.border,
              }}
              defaultOption={{
                key: 'male',
                value: 'Male',
              }}
              dropdownStyles={{ backgroundColor: 'white' }}
              dropdownTextStyles={{
                color: 'black',
                fontFamily: 'PoppinsLight',
              }}
              inputStyles={{
                textAlign: 'left',
                fontFamily: 'PoppinsMedium',
              }}
              setSelected={handleChange('gender')}
              data={[
                { key: 'male', value: 'Male' },
                { key: 'female', value: 'Female' },
              ]}
              save="key"
              search={false}
            />
            {touched.gender && errors.gender && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.gender}
              </MyText>
            )}
          </>

          <>
            {showPicker && Platform.OS === 'android' && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
              />
            )}
            {showPicker && Platform.OS === 'ios' && (
              <>
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  style={styles.date}
                />
                <HStack justifyContent="space-between" alignItems="center">
                  <Button
                    onPress={onHideDatePicker}
                    style={{
                      backgroundColor: colors.textGray,
                      borderRadius: 10,
                    }}
                  >
                    <MyText
                      poppins="Medium"
                      fontSize={12}
                      style={{ color: 'black' }}
                    >
                      Cancel
                    </MyText>
                  </Button>
                  <Button
                    style={{
                      backgroundColor: colors.dialPad,
                      borderRadius: 10,
                    }}
                    onPress={onConfirmIos}
                  >
                    <MyText
                      poppins="Medium"
                      fontSize={12}
                      style={{ color: 'white' }}
                    >
                      Confirm
                    </MyText>
                  </Button>
                </HStack>
              </>
            )}

            {Platform.OS === 'android' ? (
              <Pressable onPress={onShowDatePicker}>
                <InputComponent
                  editable={false}
                  label="Date Of Birth"
                  placeholder="Date Of Birth"
                  value={values.date_of_birth}
                />
              </Pressable>
            ) : (
              <InputComponent
                editable={false}
                label="Date Of Birth"
                placeholder="Date Of Birth"
                value={values.date_of_birth}
                onPressIn={onShowDatePicker}
              />
            )}
            {touched.date_of_birth && errors.date_of_birth && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.date_of_birth}
              </MyText>
            )}
          </>
        </VStack>

        <View style={{ marginTop: 50 }}>
          <MyButton disabled={loading} onPress={() => handleSubmit()}>
            Save Changes{' '}
          </MyButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  error: { color: 'red', marginTop: 2 },
  date: {
    height: 120,
    marginTop: -10,
  },
  camera: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    width: 20,
    height: 20,
    borderRadius: 9999,
    lineHeight: 20,
    verticalAlign: 'middle',
    position: 'absolute',
    bottom: 2,
    right: -2,
  },

  phone: {
    width: '100%',
    backgroundColor: '#E9E9E9',
    height: 60,
    paddingHorizontal: 20,

    borderRadius: 2,
  },

  border: {
    borderRadius: 2,
    minHeight: 50,
    alignItems: 'center',

    height: 60,
    backgroundColor: '#E9E9E9',
    borderWidth: 0,
  },
  content: {
    paddingLeft: 10,

    width: 60,
    color: 'black',
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
  },

  container: {
    backgroundColor: '#E9E9E9',
    color: 'black',
    fontFamily: 'PoppinsMedium',
    marginTop: 10,
  },
});
