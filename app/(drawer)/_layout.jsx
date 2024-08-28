import { Drawer } from 'expo-router/drawer';
import { enableMapSet } from 'immer';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '@/components/custom-drawer-content';

enableMapSet();

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 0, marginTop: 0 }}>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={() => <CustomDrawerContent />}
      />
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({});
