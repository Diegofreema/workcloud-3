import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import {
  ConnectionType,
  Org,
  Organization,
  Person,
  Profile,
  Requests,
  Wks,
  WorkType,
  WorkerProfile,
  WorkerProfileArray,
  Workers,
  Workspace,
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

export const usePersonalOrgs = (id: any) => {
  const getOrgs = async () => {
    const { data, error } = await supabase
      .from('organization')
      .select('*, ownerId (*)')
      .eq('ownerId', id);
    return {
      organizations: data as Organization[],
      error,
    };
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

export const useProfile = (id: any) => {
  const getProfile = async () => {
    const { data, error } = await supabase
      .from('user')
      .select(
        `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
      )
      .eq('userId', id)
      .single();

    return {
      profile: data,
      error,
    };
  };
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => getProfile(),
  });
};

export const useGetWks = (id: any) => {
  const getWks = async () => {
    const { data, error } = await supabase.from('workspace').select();
    return {
      wks: data as Wks[],
      error,
    };
  };

  return useQuery({
    queryKey: ['wks', id],
    queryFn: async () => getWks(),
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
export const useGetOtherWorkers = (id: any) => {
  const getAllStaffs = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select(`*, userId (name, avatar, userId, email)`);
    return {
      worker: data as Workers[],
      error,
    };
  };
  return useQuery({
    queryKey: ['other_workers'],
    queryFn: async () => getAllStaffs(),
  });
};

export const usePendingWorkers = (id: any) => {
  const getPendingWorker = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/request/all/${id}`
    );

    return data;
  };
  return useQuery({
    queryKey: ['pending_worker', id],
    queryFn: async () => getPendingWorker(),
  });
};
export const usePendingRequest = (id: any) => {
  const getPending = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/request/to/${id}`
    );

    return data;
  };
  return useQuery({
    queryKey: ['pending_requests', id],
    queryFn: async () => getPending(),
  });
};

export const useGetConnection = (id: any) => {
  const getConnections = async () => {
    const { data } = await axios.get(
      `http://192.168.240.212:3000/connections/all/${id}`
    );
    return data as ConnectionType;
  };
  return useQuery({
    queryKey: ['connections', id],
    queryFn: async () => getConnections(),
  });
};

export const useGetWorkerProfile = (id: any) => {
  const getWorker = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select(`*, userId (*), organizationId (name)`)
      .eq('userId', id)
      .single();
    return {
      worker: data as Workers,
      error,
    };
  };
  return useQuery({
    queryKey: ['worker', id],
    queryFn: async () => getWorker(),
  });
};

export const useGetRequests = (from: any, to: any) => {
  const getRequest = async () => {
    const { data, error } = await supabase
      .from('request')
      .select()
      .eq('from', from)
      .eq('to', to)
      .single();
    return {
      request: data as Requests,
      error,
    };
  };
  return useQuery({
    queryKey: ['request', from, to],
    queryFn: async () => getRequest(),
  });
};
export const useGetRequest = (id: any) => {
  const getRequest = async () => {
    const { data } = await axios.post(
      `http://192.168.240.212:3000/request/single`,
      {
        id,
      }
    );
    return data;
  };
  return useQuery({
    queryKey: ['single', id],
    queryFn: async () => getRequest(),
  });
};

export const useGetMyStaffs = (id: any) => {
  const getMyStaffs = async () => {
    const { data, error } = await supabase
      .from('worker')
      .select('*, userId (*)')
      .eq('bossId', id);
    return {
      staffs: data as WorkType[],
      error,
    };
  };
  return useQuery({
    queryKey: ['myStaffs', id],
    queryFn: async () => getMyStaffs(),
  });
};
