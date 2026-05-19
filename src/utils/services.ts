import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';

const GOOGLE_MAP_KEY = 'AIzaSyCB2sqGXzDeqvTrGp72iOa8fAuS1lPTNzI';

/**
 * =========================================================
 * 1. SEARCH ADDRESS (Autocomplete)
 * =========================================================
 */

export const searchAddress = async (text: string) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: text,
          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.predictions;
  } catch (error) {
    console.log('searchAddress Error:', error);
    return [];
  }
};

/**
 * =========================================================
 * 2. GET PLACE DETAILS FROM PLACE ID
 * =========================================================
 */

export const getAddressFromPlaceId = async (placeId: string) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.result;
  } catch (error) {
    console.log('getAddressFromPlaceId Error:', error);
    return null;
  }
};

/**
 * =========================================================
 * 3. GET ADDRESS FROM LAT LNG
 * =========================================================
 */

export const getAddressFromLatLng = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAP_KEY,
        },
      },
    );

    return response.data.results[0];
  } catch (error) {
    console.log('getAddressFromLatLng Error:', error);
    return null;
  }
};

/**
 * =========================================================
 * 4. GET CURRENT LOCATION
 * =========================================================
 */

export const getCurrentLocation = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },

      error => {
        console.log('Location Error:', error);
        reject(error);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

/**
 * =========================================================
 * 5. GET DIRECTIONS / ROUTE
 * =========================================================
 */

export const getDirections = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
) => {
  try {
    const response = await axios.get(
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
  } catch (error) {
    console.log('getDirections Error:', error);
    return null;
  }
};
