import { Org } from '@/constants/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const createOrg = async (orgData: Org) => {
  try {
    const { data } = await axios.post(
      'https://workcloud-server.vercel.app/organization/create',
      orgData
    );

    return data;
  } catch (error: any) {
    return { error: error.response.data.error };
  }
};

export const updateOrg = async (orgData: Org) => {
  try {
    const { data } = await axios.post(
      'https://workcloud-server.vercel.app/organization/update',
      orgData
    );

    return data;
  } catch (error: any) {
    return { error: error.response.data.error };
  }
};
