import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { defaultStyle } from '../../constants/index';
import { HeaderNav } from '../../components/HeaderNav';
import { ProfileUpdateForm } from '../../components/Forms/ProfileUpdateForm';
import { SavedDialog } from '../../components/Dialogs/SavedDialog';

const UpdateProfile = () => {
  const { userId } = useLocalSearchParams();

  return (
    <>
      <SavedDialog />

      <View style={{ zIndex: -2, ...defaultStyle }}>
        <HeaderNav title="Edit Profile" />
        <ProfileUpdateForm />
      </View>
    </>
  );
};

export default UpdateProfile;
