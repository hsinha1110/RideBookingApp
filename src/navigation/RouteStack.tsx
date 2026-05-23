import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useDispatch, useSelector } from 'react-redux';

import { RootStackParamList } from '@/screens/types';

import { RootState, AppDispatch } from '@/redux/store';

import {
  setAuthenticated,
  setRiderId,
  setUserType,
} from '@/redux/slices/authSlice';

import { secureStorage } from '@/utils/secureStorage';

import AuthStack from './AuthStack';

import { MainStack } from './MainStack';
import { DriverHomeScreen } from '@/screens';
import { DriverStack } from './DriverStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth,
  );

  //================================================
  // CHECK LOGIN
  //================================================
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await secureStorage.getItem('AUTH_TOKEN');

      const storedUser: any = await secureStorage.getObject('USER_DATA');

      console.log('TOKEN =>', token);

      console.log('STORED USER =>', storedUser);

      if (token && storedUser) {
        dispatch(setAuthenticated(true));

        dispatch(setUserType(storedUser.userType));

        dispatch(setRiderId(storedUser._id));
      }
    } catch (error) {
      console.log(error, '======= CHECK LOGIN ERROR =======');
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : userType === 'driver' ? (
          <Stack.Screen name="DriverMain" component={DriverStack} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
