import { Stack } from 'expo-router/stack';
import React from 'react';

const ScreenLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default ScreenLayout;
