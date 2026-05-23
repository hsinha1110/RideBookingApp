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
} from '@/utils/permissions';

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
        const granted = await requestAllAndroidPermissions();

        console.log(granted, '======= ANDROID PERMISSIONS =======');
      }

      //==========================================
      // IOS
      //==========================================

      if (Platform.OS === 'ios') {
        const granted = await requestLocationPermission();

        console.log(granted, '======= IOS LOCATION =======');
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
