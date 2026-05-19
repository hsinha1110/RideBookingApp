// src/utils/axiosInterceptor.ts

import Axios from 'axios';

import { store } from '@/redux/store';

import { logout } from '@/redux/slices/authSlice';
import { secureStorage } from './secureStorage';

//================ AXIOS INSTANCE =================

const axiosInterceptor = Axios.create({
  baseURL: 'http://localhost:5001/api',

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },
});

//================================================
// REQUEST INTERCEPTOR
//================================================

axiosInterceptor.interceptors.request.use(
  async config => {
    try {
      const token = await secureStorage.getItem('AUTH_TOKEN');

      console.log(token, '======= INTERCEPTOR TOKEN =======');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        console.log(`Bearer ${token}`, '======= AUTH HEADER =======');
      }

      console.log(config.url, '======= REQUEST URL =======');

      console.log(config.data, '======= REQUEST DATA =======');

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error),
);

//================================================
// RESPONSE INTERCEPTOR
//================================================

axiosInterceptor.interceptors.response.use(
  response => {
    console.log(response.data, '======= RESPONSE DATA =======');

    return response;
  },

  async error => {
    console.log(error?.response?.data, '======= API ERROR =======');

    console.log(error?.message, '======= API MESSAGE =======');

    //================ TOKEN EXPIRED =================

    if (error?.response?.status === 401) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
);

export default axiosInterceptor;
