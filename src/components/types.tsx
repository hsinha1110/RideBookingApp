import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;

  SearchScreen: {
    location: {
      latitude: number;
      longitude: number;
    };
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type PlaceItem = {
  place_id: string;
  description: string;
};

export type DestinationInputProps = {
  navigation: NavigationProp;

  currentLocation: {
    latitude: number;
    longitude: number;
  };

  destination: string;
};
