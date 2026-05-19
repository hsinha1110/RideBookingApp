import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Home,
  Profile,
  Settings,
  SearchScreen,
  RideConfirmationScreen,
  RideDetailsScreen,
} from '@/screens';

import { MainStackParamList } from '../screens/types';

import MyTabBar from './MyTabBar';
import ChatScreen from '@/screens/main/Chat/ChatScreen';

const Tab = createBottomTabNavigator<MainStackParamList>();

const Stack = createNativeStackNavigator<MainStackParamList>();

//================================================
// BOTTOM TABS
//================================================

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}
    >
      {/* HOME */}

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* PROFILE */}

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* SETTINGS */}

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

//================================================
// MAIN STACK
//================================================

export const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* BOTTOM TABS */}

      <Stack.Screen name="MainTabs" component={BottomTabs} />

      {/* SEARCH SCREEN */}

      <Stack.Screen name="SearchScreen" component={SearchScreen} />

      <Stack.Screen
        name="RideConfirmation"
        component={RideConfirmationScreen}
      />
      <Stack.Screen name="RideDetailsScreen" component={RideDetailsScreen} />

      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
