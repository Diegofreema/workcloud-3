import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { Organization } from '../constants/types';

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category,
      description,
      email,
      closing_time,
      work_days,
      website_url,
      location,
      organization_name,
      opening_time,
      ownerId,
      imageUrl,
    }: Organization) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};
