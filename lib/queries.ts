import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import {
  Org,
  Organization,
  Person,
  Profile,
  Requests,
  Wks,
  Workers,
  connections,
} from '../constants/types';
import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
const api = process.env.EXPO_PUBLIC_BACKEND_API!;
export const useFollowers = () => {
  const getFollowers = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('connections')
      .order('connections', { ascending: false });

    return {
      connections: data as connections,
      error,
    };
  };
  return useQuery({
    queryKey: ['connections'],
    queryFn: async () => getFollowers(),
  });
};

export const usePersonalOrgs = (id: string) => {
  const getOrgs = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/organization/${id}`
    );

    return data as Org;
  };
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => getOrgs(),
  });
};

export const useOtherOrgs = (id: string) => {
  const getOrgs = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/organization/other/${id}`
    );

    return data as Org[];
  };
  return useQuery({
    queryKey: ['organizationOther'],
    queryFn: async () => getOrgs(),
  });
};
export const useAssignedOrgs = () => {
  const { userId } = useAuth();
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('workspace_id(*)')
      .eq('user_id', userId);

    return {
      orgs: data,
      error,
    };
  };
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => getOrgs(),
  });
};

export const useProfile = (id: any) => {
  const getProfile = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/auth/profile/${id}`
    );
    return data as Person;
  };
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  });
};

export const useGetWks = (id: any) => {
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('wks')
      .select()
      .eq('ownerId', id);

    return {
      wks: data as Wks[],
      error,
    };
  };
  return useQuery({
    queryKey: ['wks'],
    queryFn: async () => getOrgs(),
  });
};

export const useWorkers = () => {
  const { userId } = useAuth();
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select()
      .eq('userId', userId);

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => getWorkers(),
  });
};

export const useGetPersonalWorkers = (id: any) => {
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select()
      .eq('orgId', id);

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['personal_workers'],
    queryFn: async () => getWorkers(),
  });
};
export const useGetOtherWorkers = () => {
  const { userId } = useAuth();
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select()
      .neq('userId', userId);

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['other_workers'],
    queryFn: async () => getWorkers(),
  });
};

export const useGetSingleWorker = (id: string) => {
  const getWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select(`*, workspace(*)`)
      .eq('id', id);

    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['worker', id],
    queryFn: async () => getWorkers(),
  });
};

export const usePendingWorkers = () => {
  const { userId } = useAuth();
  const getPendingWorker = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select(`*, workers(*)`)
      .eq('employerId', userId);

    return {
      requests: data as Requests[],
      error,
    };
  };
  return useQuery({
    queryKey: ['pending_worker', userId],
    queryFn: async () => getPendingWorker(),
  });
};
