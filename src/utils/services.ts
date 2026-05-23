import axios from 'axios';

import Geolocation from '@react-native-community/geolocation';

//================================================
// GOOGLE MAP KEY
//================================================

const GOOGLE_MAP_KEY = 'AIzaSyBSrX-LTpLpIuYgJSS6G0pUfQl6Q-B0y7Y';

//================================================
// AXIOS INSTANCE
//================================================

const api = axios.create({
  timeout: 15000,
});

//================================================
// SEARCH ADDRESS
//================================================

export const searchAddress = async (text: string) => {
  try {
    const response = await api.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: text,

          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.predictions || [];
  } catch (error: any) {
    console.log(
      error?.response?.data || error,
      '======= SEARCH ADDRESS ERROR =======',
    );

    return [];
  }
};

//================================================
// PLACE DETAILS
//================================================

export const getAddressFromPlaceId = async (placeId: string) => {
  try {
    const response = await api.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,

          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.result;
  } catch (error: any) {
    console.log(
      error?.response?.data || error,
      '======= PLACE DETAILS ERROR =======',
    );

    return null;
  }
};

//================================================
// ADDRESS FROM LAT LNG
//================================================

export const getAddressFromLatLng = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await api.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,

          key: GOOGLE_MAP_KEY,
        },
      },
    );

    if (response.data.status !== 'OK') {
      return null;
    }

    return response.data.results[0];
  } catch (error: any) {
    console.log(
      error?.response?.data || error,
      '======= GEOCODE ERROR =======',
    );

    return null;
  }
};

//================================================
// GET CURRENT LOCATION
//================================================

export const getCurrentLocation = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(
          position.coords,
          '======= CURRENT LOCATION SUCCESS =======',
        );

        resolve(position.coords);
      },

      error => {
        console.log(error, '======= CURRENT LOCATION ERROR =======');

        reject(error);
      },

      {
        enableHighAccuracy: true,

        timeout: 30000,

        maximumAge: 10000,
      },
    );
  });
};

//================================================
// WATCH LIVE LOCATION
//================================================

export const watchCurrentLocation = (
  onLocationUpdate: (coords: any) => void,

  onError?: (error: any) => void,
) => {
  const watchId = Geolocation.watchPosition(
    position => {
      console.log(position.coords, '======= LIVE LOCATION SUCCESS =======');

      onLocationUpdate(position.coords);
    },

    error => {
      console.log(error, '======= LIVE LOCATION ERROR =======');

      onError?.(error);
    },

    {
      enableHighAccuracy: true,

      distanceFilter: 10,

      interval: 5000,

      fastestInterval: 2000,
    },
  );

  return watchId;
};

//================================================
// CLEAR LOCATION WATCHER
//================================================

export const clearLocationWatcher = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};

//================================================
// DIRECTIONS
//================================================

export const getDirections = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
) => {
  try {
    const response = await api.get(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin: `${originLat},${originLng}`,

          destination: `${destLat},${destLng}`,

          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.routes[0];
  } catch (error: any) {
    console.log(
      error?.response?.data || error,
      '======= DIRECTIONS ERROR =======',
    );

    return null;
  }
};
