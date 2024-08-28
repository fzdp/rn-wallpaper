import { theme } from '@/constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CustomDrawerContent = (props) => {
  const router = useRouter();
  return (
    <DrawerContentScrollView style={styles.container}>
      <DrawerItem
        label="我的收藏"
        labelStyle={styles.drawerLabel}
        icon={(color, size) => <MaterialIcons name="favorite" size={24} />}
        onPress={() => router.push('favorites')}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {},
  drawerLabel: {},
});
