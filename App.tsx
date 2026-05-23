//================================================
// APP.tsx
//================================================

import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Platform, View } from 'react-native';

import { Provider, useDispatch } from 'react-redux';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Routes from '@/navigation/RouteStack';

import { store, AppDispatch } from '@/redux/store';

import { setAuthenticated } from '@/redux/slices/authSlice';

import { secureStorage } from '@/utils/secureStorage';

import {
  requestAllAndroidPermissions,
  requestLocationPermission,
  requestNotificationPermission,
} from '@/utils/permissions';

import { initializeNotifications, getFcmToken } from '@/utils/notification';

//================================================
// APP CONTENT
//================================================

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);

  //================================================
  // INITIALIZE APP
  //================================================

  useEffect(() => {
    initializeApp();
  }, []);

  //================================================
  // INITIALIZE
  //================================================

  const initializeApp = async () => {
    try {
      //==========================================
      // ANDROID
      //==========================================

      if (Platform.OS === 'android') {
        //======================================
        // CAMERA + LOCATION + GALLERY
        //======================================

        const granted = await requestAllAndroidPermissions();

        console.log(granted, '======= ANDROID PERMISSIONS =======');

        //======================================
        // NOTIFICATION PERMISSION
        //======================================

        if (Platform.Version >= 33) {
          const notificationGranted = await requestNotificationPermission();

          console.log(
            notificationGranted,
            '======= NOTIFICATION PERMISSION =======',
          );
        }
      }

      //==========================================
      // IOS
      //==========================================

      if (Platform.OS === 'ios') {
        //======================================
        // LOCATION
        //======================================

        const locationGranted = await requestLocationPermission();

        console.log(locationGranted, '======= IOS LOCATION =======');

        //======================================
        // NOTIFICATION
        //======================================

        const notificationGranted = await requestNotificationPermission();

        console.log(notificationGranted, '======= IOS NOTIFICATION =======');
      }

      //==========================================
      // INITIALIZE FIREBASE
      //==========================================

      await initializeNotifications();

      //==========================================
      // GET FIREBASE TOKEN
      //==========================================

      const fcmToken = await getFcmToken();

      console.log(fcmToken, '======= FIREBASE FCM TOKEN =======');

      //==========================================
      // SAVE FCM TOKEN
      //==========================================

      if (fcmToken) {
        await secureStorage.setItem('FCM_TOKEN', fcmToken);

        console.log('FCM TOKEN SAVED SUCCESSFULLY');
      }

      //==========================================
      // CHECK LOGIN
      //==========================================

      const token = await secureStorage.getItem('AUTH_TOKEN');

      console.log(token, '======= STORED TOKEN =======');

      if (token) {
        dispatch(setAuthenticated(true));
      }
    } catch (error) {
      console.log(error, '======= APP INIT ERROR =======');
    } finally {
      setLoading(false);
    }
  };

  //================================================
  // LOADER
  //================================================

  if (loading) {
    return (
      <View
        style={{
          flex: 1,

          justifyContent: 'center',

          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  //================================================
  // ROUTES
  //================================================

  return <Routes />;
};

//================================================
// APP
//================================================

const App = () => {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
