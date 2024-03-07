import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { Organization, Profile } from '../constants/types';
import { StreamChat } from 'stream-chat';
import Toast from 'react-native-toast-message';
import { useUser } from '@clerk/clerk-expo';
const client = StreamChat.getInstance('cnvc46pm8uq9');
// export const useCreateOrganization = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       category,
//       description,
//       email,
//       closing_time,
//       work_days,
//       website_url,
//       location,
//       organization_name,
//       opening_time,
//       ownerId,
//       imageUrl,
//     }: Organization) => {},
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['organizations'] });
//     },
//   });
// };

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const generateToken = async () => {
    if (!user?.id) return;
    console.log('🚀 ~ file: generateToken.ts:generateToken ~ user:', user);
    console.log();
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select()
      .eq('user_id', user?.id);
    if (profileError) {
      return Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try signing again',
      });
    }

    if (!profile?.length) {
      const { data, error } = await supabase.from('profile').insert({
        user_id: user?.id,
        avatarUrl: user?.imageUrl,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.fullName,
        boarded: true,
        streamToken: client.devToken(user?.id),
      });

      if (error) {
        console.log(
          '🚀 ~ file: generateToken.ts:generateToken ~ error:',
          error
        );

        return Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try signing again',
        });
      }
    }
  };
  return useMutation({
    mutationFn: async () => generateToken(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
