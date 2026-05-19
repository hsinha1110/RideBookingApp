import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ASYNC_ROUTES } from '../constants/redux.constant';
import {
  acceptRejectRideService,
  allRiderRidesService,
  cancelRideService,
  getChatMessagesService,
  loginService,
  requestRideService,
  sendOtpService,
  signUpService,
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
      if (response.data?.token) {
        await secureStorage.setItem('AUTH_TOKEN', response.data.token);
      }
      if (response.data?.user) {
        await secureStorage.setObject('USER_DATA', response.data.user);
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
      status: 'accepted' | 'rejected';
    },

    { rejectWithValue },
  ) => {
    try {
      const response = await acceptRejectRideService(payload);

      console.log(
        response.data.messages,
        '======= ACCEPT/REJECT RIDE RESPONSE =======',
      );

      return response.data.messages;
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
