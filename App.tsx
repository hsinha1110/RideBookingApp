import React, { useEffect, useState } from 'react';

import { ActivityIndicator, View } from 'react-native';

import { Provider, useDispatch } from 'react-redux';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Routes from '@/navigation/RouteStack';

import { store, AppDispatch } from '@/redux/store';

import { setAuthenticated } from '@/redux/slices/authSlice';

import { secureStorage } from '@/utils/secureStorage';

//================================================
// APP CONTENT
//================================================

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);

  //================ CHECK SESSION =================

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await secureStorage.getItem('AUTH_TOKEN');

      console.log(token, '======= STORED TOKEN =======');

      if (token) {
        dispatch(setAuthenticated(true));
      }
    } catch (error) {
      console.log(error, '======= SESSION ERROR =======');
    } finally {
      setLoading(false);
    }
  };

  //================ LOADER =================

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

  return <Routes />;
};

//================================================
// APP
//================================================

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
