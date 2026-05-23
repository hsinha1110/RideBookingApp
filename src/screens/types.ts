import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { NavigatorScreenParams } from '@react-navigation/native';

//================================================
// ROOT STACK
//================================================

export type RootStackParamList = {
  Auth: undefined;

  Main: NavigatorScreenParams<MainStackParamList>;

  DriverMain: NavigatorScreenParams<DriverStackParamList>;
};

//================================================
// AUTH STACK
//================================================

export type AuthStackParamList = {
  Login: undefined;

  Signup: undefined;

  OnBoarding: undefined;

  OTPVerification: {
    phoneNumber: string;

    userRole: 'rider' | 'driver';
  };
};

//================================================
// MAIN STACK
//================================================

export type MainStackParamList = {
  Home: undefined;

  Profile: undefined;

  Settings: undefined;

  MainTabs: undefined;

  DriverHome: undefined;
  UpdateProfile: undefined;
  Chat: {
    rideId: string;
  };

  RideConfirmation: undefined;

  RideDetailsScreen: {
    rideId: string;

    pickupLocation: any;

    destinationLocation: any;
  };

  SearchScreen: {
    location: {
      latitude: number;
      longitude: number;
    };

    pickupAddress: string;
  };
};

//================================================
// DRIVER STACK
//================================================

export type DriverStackParamList = {
  DriverHome: undefined;

  Profile: undefined;

  Settings: undefined;

  Chat: {
    rideId: string;
  };
};

//================================================
// NAVIGATION TYPES
//================================================

export type MainNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export type DriverNavigationProp =
  NativeStackNavigationProp<DriverStackParamList>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

//================================================
// PLACE ITEM
//================================================

export interface PlaceItem {
  place_id: string;

  description: string;
}
