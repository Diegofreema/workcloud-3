import { HStack } from '@gluestack-ui/themed';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { HeadingText } from '../Ui/HeadingText';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ConnectionType } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import { useData } from '@/hooks/useData';
import { EmptyText } from '../EmptyText';
import { Item } from '../Item';
import { Avatar } from 'react-native-paper';

const fourItems = [1, 2, 3, 4];
export const MiddleCard = (): JSX.Element => {
  const queryClient = useQueryClient();
  const { id } = useData();
  const [connections, setConnections] = useState<ConnectionType[]>([]);

  useEffect(() => {
    const getConnections = async () => {
      const { data } = await supabase
        .from('connections')
        .select(`*, connectedTo (*, organizationId(*))`)
        .eq('owner', id);

      return data as ConnectionType[];
    };
    const getAllConnections = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['connections', id],
        queryFn: getConnections,
      });

      setConnections(data);
    };

    getAllConnections();
  }, []);
  const router = useRouter();

  const firstSix = connections.slice(0, 6);
  return (
    <View>
      {connections?.length > 0 && (
        <>
          <HeadingText link="/connections" />
          <View style={{ marginTop: 10 }} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              gap: 15,
            }}
            data={firstSix}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return <Images item={item} />;
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

const Images = ({ item }: { item: ConnectionType }) => {
  const router = useRouter();
  const startChannel = async () => {
    router.push(`/reception/${item?.connectedTo?.organizationId?.id}`);
  };
  return (
    <Pressable onPress={startChannel}>
      <Avatar.Image
        size={50}
        source={{ uri: item?.connectedTo?.organizationId?.avatar }}
      />
    </Pressable>
  );
};
