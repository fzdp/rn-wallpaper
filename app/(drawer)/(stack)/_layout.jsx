import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '@/constants/theme';

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarColor: theme.colors.statusBar,
        headerStyle: {
          backgroundColor: theme.colors.statusBar,
        },
      }}
    >
      <Stack.Screen
        name="favorites"
        options={{
          headerTitle: '我的收藏',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="image-detail"
        options={{
          headerShown: true,
          headerTitle: '详情',
        }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
