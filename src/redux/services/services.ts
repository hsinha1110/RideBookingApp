import { AxiosResponse } from 'axios';

import { METHODS, replaceUrl, SERVICE_ROUTES } from '../constants';

import { loginPayload, sendOtpPayload, SignUpPayload } from '../types';
import axiosInterceptor from '@/utils/utils';
import { secureStorage } from '@/utils/secureStorage';

//================================================
// SIGNUP
//================================================

export const signUpService = async (data: FormData): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.SIGN_UP,
      method: METHODS.POST,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data, '======= SIGNUP RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= SIGNUP ERROR =======');

    throw error;
  }
};
//================================================
// LOGIN
//================================================

export const loginService = async (
  data: loginPayload,
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.LOGIN,

      method: METHODS.POST,

      data,
    });

    console.log(response.data, '======= LOGIN RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= LOGIN ERROR =======');

    throw error;
  }
};

//================================================
// SEND OTP
//================================================

export const sendOtpService = async (
  data: sendOtpPayload,
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.SEND_OTP,

      method: METHODS.POST,

      data,
    });

    console.log(response.data, '======= SEND OTP RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= SEND OTP ERROR =======');

    throw error;
  }
};

//================================================
// VERIFY OTP
//================================================

export const verifyOtpService = async (data: {
  phoneNumber: string;
  otp: string;
}): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.VERIFY_OTP,

      method: METHODS.POST,

      data,
    });

    console.log(response.data, '======= VERIFY OTP RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= VERIFY OTP ERROR =======');

    throw error;
  }
};
export const requestRideService = async (data: {
  pickup: {
    latitude: number;

    longitude: number;

    description: string;

    place_id: string;

    name: string;
  };

  destination: {
    latitude: number;

    longitude: number;

    description: string;

    place_id: string;

    name: string;
  };
}): Promise<AxiosResponse> => {
  try {
    //================================================
    // TOKEN
    //================================================

    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(token, '======= AUTH TOKEN =======');

    //================================================
    // TOKEN NOT FOUND
    //================================================

    if (!token) {
      throw new Error('Token not found');
    }

    //================================================
    // PAYLOAD
    //================================================

    const payload = {
      pickup: {
        latitude: data.pickup.latitude,

        longitude: data.pickup.longitude,

        description: data.pickup.description,

        place_id: data.pickup.place_id,

        name: data.pickup.name,
      },

      destination: {
        latitude: data.destination.latitude,

        longitude: data.destination.longitude,

        description: data.destination.description,

        place_id: data.destination.place_id,

        name: data.destination.name,
      },
    };

    console.log(payload, '======= REQUEST RIDE PAYLOAD =======');

    //================================================
    // API CALL
    //================================================

    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.REQUEST,

      method: METHODS.POST,

      data: payload,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, '======= REQUEST RIDE RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(
      error?.response?.data || error?.message,
      '======= REQUEST RIDE ERROR =======',
    );

    throw error;
  }
};
export const allRiderRidesService = async (
  type: 'current' | 'past',
): Promise<AxiosResponse> => {
  try {
    //============================================
    // TOKEN
    //============================================

    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(token, '======= RIDER RIDES TOKEN =======');

    //============================================
    // URL
    //============================================

    const url = `${SERVICE_ROUTES.ALL_RIDER_RIDES}?type=${type}&userType=rider`;

    console.log(url, '======= ALL RIDER RIDES URL =======');

    //============================================
    // API
    //============================================

    const response = await axiosInterceptor({
      url,

      method: METHODS.GET,

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, '======= ALL RIDER RIDES RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= ALL RIDER RIDES ERROR =======');

    throw error;
  }
};
export const acceptRejectRideService = async (data: {
  rideId: string;
  status: 'accepted' | 'cancelled';
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    const payload = {
      rideId: data.rideId,
      status: data.status,
    };

    console.log(payload, '======= ACCEPT REJECT RIDE PAYLOAD =======');

    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.ACCEPT_REJECT,

      method: METHODS.PUT,

      data: payload,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, '======= ACCEPT REJECT RIDE RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(
      error?.response?.data,
      '======= ACCEPT REJECT RIDE ERROR =======',
    );

    throw error;
  }
};

export const cancelRideService = async (data: {
  rideId: string;
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(data, '======= CANCEL PAYLOAD =======');

    const response = await axiosInterceptor({
      url: replaceUrl(SERVICE_ROUTES.CANCEL_RIDE, {
        rideId: data.rideId,
      }),

      method: METHODS.PUT,

      data: {
        rideId: data.rideId,
      },

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, '======= CANCEL RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= CANCEL ERROR =======');

    throw error;
  }
};

export const getChatMessagesService = async (data: {
  rideId: string;
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(data, '======= GET MESSAGES PAYLOAD =======');

    const response = await axiosInterceptor({
      url: replaceUrl(SERVICE_ROUTES.GET_MESSAGES, {
        rideId: data.rideId,
      }),

      method: METHODS.GET,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      response.data.messages,
      '======= GET MESSAGES RESPONSE =======',
    );

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= GET MESSAGES ERROR =======');

    throw error;
  }
};
export const getDriverStatusService = async (data: {
  riderId: string;
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    const response = await axiosInterceptor({
      url: replaceUrl(SERVICE_ROUTES.DRIVER_STATUS, {
        driverId: data.riderId,
      }),

      method: METHODS.GET,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};
export const updateDriverLocationService = async (data: {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  rideId?: string | null;
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(data, '======= UPDATE DRIVER LOCATION PAYLOAD =======');

    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.UPDATE_DRIVER_LOCATION,
      method: METHODS.POST,

      data: {
        driverId: data.driverId,

        lat: data.lat,

        lng: data.lng,

        heading: data.heading || 0,

        rideId: data.rideId || null,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      response.data,
      '======= UPDATE DRIVER LOCATION RESPONSE =======',
    );

    return response;
  } catch (error: any) {
    console.log(
      error?.response?.data,
      '======= UPDATE DRIVER LOCATION ERROR =======',
    );

    throw error;
  }
};

export const updateBackgroundLocationService = async (data: {
  driverId: string;

  rideId: string;

  latitude: number;

  longitude: number;

  heading?: number;
}): Promise<AxiosResponse> => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    const payload = {
      driverId: data.driverId,

      rideId: data.rideId,

      location: {
        coords: {
          latitude: data.latitude,

          longitude: data.longitude,

          heading: data.heading || 0,
        },
      },
    };

    console.log(payload, '======= BACKGROUND LOCATION PAYLOAD =======');

    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.LOCATION_BACKGROUND,

      method: METHODS.POST,

      data: payload,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, '======= BACKGROUND LOCATION RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(
      error?.response?.data,
      '======= BACKGROUND LOCATION ERROR =======',
    );

    throw error;
  }
};
export const getProfileService = async (): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.GET_PROFILE,

      method: METHODS.GET,
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const updateProfileService = async (
  data: FormData,
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInterceptor({
      url: SERVICE_ROUTES.UPDATE_PROFILE,

      method: METHODS.PUT,

      data,

      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data, '======= UPDATE PROFILE RESPONSE =======');

    return response;
  } catch (error: any) {
    console.log(error?.response?.data, '======= UPDATE PROFILE ERROR =======');

    throw error;
  }
};
