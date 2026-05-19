import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';

import { RootStackParamList } from '@/screens/types';
import { DriverStack } from './DriverStack';
import { MainStack } from './MainStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* AUTH */}

        <Stack.Screen name="Auth" component={AuthStack} />

        {/* RIDER */}

        <Stack.Screen name="Main" component={MainStack} />

        {/* DRIVER */}

        <Stack.Screen name="DriverMain" component={DriverStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
