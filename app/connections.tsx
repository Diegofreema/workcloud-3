import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { HeaderNav } from '../components/HeaderNav';
import { defaultStyle } from '../constants/index';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Organization } from '../components/organization/Organization';

type Props = {};

const connections = (props: Props) => {
  const { darkMode } = useDarkMode();
  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const arr = [1, 2, 3, 4];
    const lastIndex = arr.length - 1;
    const isLastItemOnList = arr[lastIndex];
    console.log('🚀 ~ connections ~ isLastItemOnList:', isLastItemOnList);
    const isLastItem = index === lastIndex;
    return <Organization isLastItem={isLastItem} />;
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode ? 'black' : 'white',
        ...defaultStyle,
      }}
    >
      <HeaderNav title="All Connections" RightComponent={SearchComponent} />
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const SearchComponent = () => {
  const { darkMode } = useDarkMode();
  return (
    <EvilIcons name="search" color={darkMode ? 'white' : 'black'} size={24} />
  );
};
export default connections;

const styles = StyleSheet.create({});
