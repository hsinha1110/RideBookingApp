import { NativeStackNavigationProp } from '@react-navigation/native-stack';

//================================================
// ROOT STACK PARAM LIST
//================================================

export type RootStackParamList = {
  Home: undefined;

  SearchScreen: {
    location: {
      latitude: number;
      longitude: number;
    };

    pickupAddress: string;
  };
};

//================================================
// NAVIGATION PROP
//================================================

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

//================================================
// PLACE ITEM
//================================================

export type PlaceItem = {
  place_id: string;

  description: string;
};

//================================================
// DESTINATION INPUT PROPS
//================================================

export type DestinationInputProps = {
  navigation: NavigationProp;

  currentLocation: {
    latitude: number;
    longitude: number;
  };

  destination: string;

  pickupAddress: string;
};
