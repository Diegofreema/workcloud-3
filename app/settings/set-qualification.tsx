import { View, StyleSheet } from 'react-native';
import { VStack } from '@gluestack-ui/themed';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { useFormik } from 'formik';

import { defaultStyle } from '../../constants/index';
import { HeaderNav } from '../../components/HeaderNav';
import { InputComponent } from '../../components/InputComponent';
import { MyButton } from '../../components/Ui/MyButton';
import { useSaved } from '../../hooks/useSaved';

const Qualifications = () => {
  const { errors, values, handleChange, handleSubmit, resetForm, touched } =
    useFormik({
      initialValues: {
        summary: '',
        services: '',
        skills: '',
      },
      onSubmit: () => {},
    });

  const { services, skills, summary } = values;
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <HeaderNav title="Set qualifications" />

      <VStack mt={20} space={'3xl'}>
        <TextInput
          activeUnderlineColor="transparent"
          multiline
          placeholderTextColor={'black'}
          placeholder="Add a summary about yourself"
          contentStyle={styles.content}
          value={summary}
          onChangeText={handleChange('summary')}
        />

        <InputComponent
          placeholder="Services"
          value={services}
          onChangeText={handleChange('services')}
        />
        <InputComponent
          placeholder="Skills"
          value={skills}
          onChangeText={handleChange('skills')}
        />
      </VStack>

      <View style={{ marginTop: 40 }}>
        <MyButton>Save Changes</MyButton>
      </View>
    </View>
  );
};

export default Qualifications;

const styles = StyleSheet.create({
  content: {
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
    color: 'black',
    paddingVertical: 10,
    height: 80,
    backgroundColor: '#E9E9E9',
    borderRadius: 5,
  },
});
