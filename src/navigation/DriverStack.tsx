import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DriverHomeScreen, Profile, Settings } from '@/screens';

import { DriverStackParamList } from '@/screens/types';
import ChatScreen from '@/screens/main/Chat/ChatScreen';

const Stack = createNativeStackNavigator<DriverStackParamList>();

export const DriverStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* DRIVER HOME */}

      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />

      {/* PROFILE */}

      <Stack.Screen name="Profile" component={Profile} />

      {/* SETTINGS */}

      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
