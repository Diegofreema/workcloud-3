import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Searchbar, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDebounce } from 'use-debounce';
import { useSearch } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { HStack, VStack } from '@gluestack-ui/themed';
import { MyText } from '@/components/Ui/MyText';
import { Org } from '@/constants/types';
type Props = {};

const Search = (props: Props) => {
  const [value, setValue] = useState('');
  const [val] = useDebounce(value, 1000);
  const { data, refetch, isPaused, isPending, isError, isRefetching } =
    useSearch(val);

  if (isError || isPaused) {
    return (
      <View style={styles.container}>
        <SearchHeader value={value} setValue={setValue} />
        <ErrorComponent refetch={refetch} />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <SearchHeader value={value} setValue={setValue} />
        <LoadingComponent />
      </View>
    );
  }

  const { organization } = data;

  return (
    <View style={styles.container}>
      <SearchHeader value={value} setValue={setValue} />
      <FlatList
        ListHeaderComponent={() => (
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'PoppinsMedium',
              marginBottom: 20,
            }}
          >
            Results
          </Text>
        )}
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        data={organization}
        renderItem={({ item }) => {
          console.log('🚀 ~ renderItem ~ item:', item);

          return <OrganizationItem item={item} />;
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
});

const SearchHeader = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (text: string) => void;
}) => {
  const router = useRouter();
  const onPress = () => {
    if (value === '') {
      router.back();
    }
  };
  return (
    <Searchbar
      style={{
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        color: 'black',
        fontFamily: 'PoppinsMedium',
      }}
      placeholderTextColor={'black'}
      inputStyle={{ fontFamily: 'PoppinsMedium', color: 'black' }}
      placeholder="Search by description"
      onChangeText={setValue}
      value={value}
      icon={value === '' ? 'arrow-left' : 'magnify'}
      iconColor="black"
      onIconPress={onPress}
    />
  );
};

const OrganizationItem = ({ item }: { item: Org }) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      // @ts-ignore
      onPress={() => router.push(`reception/${item.id}`)}
    >
      <HStack alignItems="center" gap={10}>
        <Avatar.Image source={{ uri: item?.avatar }} size={50} />
        <VStack>
          <MyText poppins="Bold" fontSize={14}>
            {item?.name}
          </MyText>
          <MyText poppins="Medium" fontSize={12}>
            {item?.description}
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};
