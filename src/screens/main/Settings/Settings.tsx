import React, { FC } from 'react';

import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/redux/store';

import {
  setAuthenticated,
  setRiderId,
  setUserType,
} from '@/redux/slices/authSlice';

import { secureStorage } from '@/utils/secureStorage';

//================================================
// SCREEN
//================================================

const Settings: FC = () => {
  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // LOGOUT
  //================================================

  const handleLogout = async () => {
    try {
      // REMOVE TOKEN

      await secureStorage.removeItem('token');

      await secureStorage.removeItem('user');

      // RESET REDUX

      dispatch(setAuthenticated(false));

      dispatch(setRiderId(''));

      dispatch(setUserType(''));

      Alert.alert('Success', 'Logout Successfully');
    } catch (error) {
      console.log(error, '======= LOGOUT ERROR =======');
    }
  };

  //================================================
  // UI
  //================================================

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

//================================================
// STYLES
//================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#fff',

    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,

    fontWeight: '700',

    color: '#000',

    marginBottom: 30,
  },

  logoutBtn: {
    width: '100%',

    height: 55,

    backgroundColor: 'red',

    borderRadius: 14,

    justifyContent: 'center',

    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '700',
  },
});
