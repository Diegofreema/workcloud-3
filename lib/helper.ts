import { Org } from '@/constants/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const createOrg = async (orgData: Org) => {
  try {
    const { data } = await axios.post(
      'http://192.168.240.212:3000/organization/create',
      orgData
    );

    return data;
  } catch (error: any) {
    return { error: error.response.data.error };
  }
};
