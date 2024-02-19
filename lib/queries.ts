import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import { Organization, Profile, connections } from '../constants/types';
// import { useAuth } from '@clerk/clerk-expo';

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
export const usePersonalOrgs = () => {
  // const { userId } = useAuth();
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select()
      .eq('owner_id', 'userId');

    return {
      orgs: data as Organization[],
      error,
    };
  };
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => getOrgs(),
  });
};
export const useAssignedOrgs = () => {
  // const { userId } = useAuth();
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('workspace_id(*)')
      .eq('user_id', 'userId');

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

export const useGetSingleOrg = (id: any) => {
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('workspace')
      .select()
      .eq('id', id);

    return {
      orgs: data as Organization[],
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
    const { data, error } = await supabase
      .from('profile')
      .select()
      .eq('user_id', id);

    return {
      profile: data as Profile[],
      error,
    };
  };
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  });
};
