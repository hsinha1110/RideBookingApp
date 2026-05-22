import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ASYNC_ROUTES } from '../constants/redux.constant';
import {
  acceptRejectRideService,
  allRiderRidesService,
  cancelRideService,
  getChatMessagesService,
  getDriverStatusService,
  loginService,
  requestRideService,
  sendOtpService,
  signUpService,
  updateBackgroundLocationService,
  updateDriverLocationService,
  verifyOtpService,
} from '../services/services';
import { ErrorResponse, loginPayload, SignUpPayload } from '../types';
import { secureStorage } from '@/utils/secureStorage';

export const signUpAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.SIGN_UP,
  async (payload: SignUpPayload, { rejectWithValue }) => {
    try {
      console.log(payload, '======= SIGNUP PAYLOAD =======');

      const response = await signUpService(payload);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'Something went wrong',
        },
      );
    }
  },
);
export const loginAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.LOGIN,
  async (payload: loginPayload, { rejectWithValue }) => {
    try {
      console.log(payload, '======= LOGIN PAYLOAD =======');

      const response = await loginService(payload);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'Something went wrong',
        },
      );
    }
  },
);

export const sendOtpAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.SEND_OTP,

  async (payload: { phoneNumber: string }, { rejectWithValue }) => {
    try {
      const response = await sendOtpService(payload);

      console.log(response.data, '======= SEND OTP RESPONSE =======');

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'Something went wrong',
        },
      );
    }
  },
);

export const verifyOtpAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.VERIFY_OTP,

  async (
    payload: {
      phoneNumber: string;
      otp: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await verifyOtpService(payload);

      console.log(response.data, '======= VERIFY OTP RESPONSE =======');

      // FIXED
      if (response.data?.data?.token) {
        await secureStorage.setItem('AUTH_TOKEN', response.data.data.token);
      }

      // FIXED
      if (response.data?.data) {
        await secureStorage.setObject('USER_DATA', response.data.data);
      }

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'OTP verification failed',
        },
      );
    }
  },
);
export const requestRideAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.REQUEST,

  async (
    payload: {
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
    },

    { rejectWithValue },
  ) => {
    try {
      const response = await requestRideService(payload);

      console.log(response.data, '======= REQUEST RIDE RESPONSE =======');

      return response.data;
    } catch (error: any) {
      console.log(error?.response?.data, '======= REQUEST RIDE ERROR =======');

      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const allRiderRidesAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.ALL_RIDER_RIDES,

  async (
    type: 'current' | 'past',

    { rejectWithValue },
  ) => {
    try {
      const response = await allRiderRidesService(type);

      console.log(response.data, '======= ALL RIDER RIDES RESPONSE =======');

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'Something went wrong',
        },
      );
    }
  },
);

export const acceptRejectAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.ACCEPT_REJECT,

  async (
    payload: {
      rideId: string;
      status: 'accepted' | 'cancelled';
    },

    { rejectWithValue },
  ) => {
    try {
      const response = await acceptRejectRideService(payload);

      console.log(response.data, '======= ACCEPT/REJECT RIDE RESPONSE =======');

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      return rejectWithValue(
        err.response?.data || {
          message: 'Something went wrong',
        },
      );
    }
  },
);
export const cancelRideAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.CANCEL_RIDE,

  async (
    payload: {
      rideId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await cancelRideService(payload);

      return response.data;
    } catch (error: any) {
      console.log(error?.response?.data, '======= CANCEL ERROR =======');

      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const getChatMessagesAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.GET_MESSAGES,

  async (
    payload: {
      rideId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await getChatMessagesService(payload);

      return response.data;
    } catch (error: any) {
      console.log(error?.response?.data, '======= GET MESSAGES ERROR =======');

      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const driverStatusAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.DRIVER_STATUS,

  async (
    payload: {
      riderId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await getDriverStatusService(payload);

      console.log(response.data, '======= DRIVER STATUS RESPONSE =======');

      return response.data;
    } catch (error: any) {
      console.log(error?.response?.data, '======= DRIVER STATUS ERROR =======');

      return rejectWithValue(
        error?.response?.data?.message || 'Something went wrong',
      );
    }
  },
);
export const updateDriverLocationAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.UPDATE_DRIVER_LOCATION,

  async (
    payload: {
      driverId: string;
      lat: number;
      lng: number;
      heading?: number;
      rideId?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateDriverLocationService(payload);
      console.log(response, '.........jeladsds');
      console.log(
        response.data,
        '======= UPDATE DRIVER LOCATION RESPONSE =======',
      );

      return response.data;
    } catch (error: any) {
      console.log(
        error?.response?.data,
        '======= UPDATE DRIVER LOCATION ERROR =======',
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Location update failed',
      );
    }
  },
);

export const updateBackgroundLocationAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.LOCATION_BACKGROUND,

  async (
    payload: {
      driverId: string;

      rideId: string;

      latitude: number;

      longitude: number;

      heading?: number;
    },

    { rejectWithValue },
  ) => {
    try {
      const response = await updateBackgroundLocationService(payload);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Background location update failed',
      );
    }
  },
);
