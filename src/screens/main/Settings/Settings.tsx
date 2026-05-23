import React, { FC, useEffect } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/redux/store';

import {
  setAuthenticated,
  setRiderId,
  setUserType,
} from '@/redux/slices/authSlice';

import { secureStorage } from '@/utils/secureStorage';

import { getProfileThunk } from '@/redux/thunk/thunk';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { NavigationProp } from '@/components/types';

//================================================
// SCREEN
//================================================

const Settings: FC = () => {
  //================================================
  // NAVIGATION
  //================================================

  const navigation = useNavigation<NavigationProp>();

  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  //================================================
  // GET PROFILE
  //================================================

  useEffect(() => {
    dispatch(getProfileThunk());
  }, []);

  //================================================
  // NAVIGATION HANDLER
  //================================================

  const handleNavigation = (type: string) => {
    switch (type) {
      //==========================================
      // EDIT PROFILE
      //==========================================

      case 'edit-profile':
        navigation.navigate('UpdateProfile');

        break;

      //==========================================
      // LANGUAGE
      //==========================================

      case 'language':
        navigation.navigate('LanguageScreen');

        break;

      //==========================================
      // DARK MODE
      //==========================================

      case 'dark-mode':
        console.log('Dark Mode Pressed');

        break;

      //==========================================
      // DEFAULT
      //==========================================

      default:
        break;
    }
  };

  //================================================
  // LOGOUT
  //================================================

  const handleLogout = async () => {
    try {
      //========================================
      // REMOVE STORAGE
      //========================================

      await secureStorage.removeItem('token');

      await secureStorage.removeItem('user');

      //========================================
      // RESET REDUX
      //========================================

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
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <Text style={styles.header}>Profile</Text>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          {/* IMAGE */}

          <Image
            source={{
              uri:
                user?.profileImage ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.profileImage}
          />

          {/* DETAILS */}

          <View
            style={{
              flex: 1,

              marginLeft: 14,
            }}
          >
            <Text style={styles.name}>{user?.fullName || 'User'}</Text>

            <Text style={styles.email}>{user?.email || 'No Email'}</Text>

            <Text style={styles.phone}>{user?.phoneNumber || 'No Phone'}</Text>
          </View>
        </View>

        {/* SETTINGS */}

        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.card}>
          {/* DARK MODE */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.row}
            onPress={() => handleNavigation('dark-mode')}
          >
            <View style={styles.leftRow}>
              <Ionicons name="moon-outline" size={22} color="#000" />

              <Text style={styles.rowText}>Dark Mode</Text>
            </View>

            <Switch value={false} />
          </TouchableOpacity>

          {/* LANGUAGE */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.row}
            onPress={() => handleNavigation('language')}
          >
            <View style={styles.leftRow}>
              <Ionicons name="language-outline" size={22} color="#000" />

              <Text style={styles.rowText}>Switch Language</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* ACCOUNT */}

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          {/* EDIT PROFILE */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.row}
            onPress={() => handleNavigation('edit-profile')}
          >
            <View style={styles.leftRow}>
              <Ionicons name="person-outline" size={22} color="#000" />

              <Text style={styles.rowText}>Edit Profile</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          {/* LOGOUT */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.row}
            onPress={handleLogout}
          >
            <View style={styles.leftRow}>
              <Ionicons name="log-out-outline" size={22} color="red" />

              <Text
                style={[
                  styles.rowText,
                  {
                    color: 'red',
                  },
                ]}
              >
                Logout
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* APP INFO */}

        <Text style={styles.sectionTitle}>App Info</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftRow}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#000"
              />

              <Text style={styles.rowText}>Version</Text>
            </View>

            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

//================================================
// STYLES
//================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F7F7F7',

    paddingHorizontal: 20,
  },

  header: {
    fontSize: 30,

    fontWeight: '700',

    color: '#000',

    marginTop: 20,

    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: '#fff',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 28,

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  profileImage: {
    width: 78,

    height: 78,

    borderRadius: 100,

    backgroundColor: '#EEE',
  },

  name: {
    fontSize: 20,

    fontWeight: '700',

    color: '#000',
  },

  email: {
    fontSize: 14,

    color: '#777',

    marginTop: 4,
  },

  phone: {
    fontSize: 14,

    color: '#777',

    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,

    fontWeight: '700',

    color: '#000',

    marginBottom: 14,
  },

  card: {
    backgroundColor: '#fff',

    borderRadius: 22,

    paddingHorizontal: 16,

    marginBottom: 24,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  row: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingVertical: 18,

    borderBottomWidth: 1,

    borderBottomColor: '#F2F2F2',
  },

  leftRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  rowText: {
    fontSize: 15,

    fontWeight: '500',

    color: '#000',

    marginLeft: 14,
  },

  versionText: {
    fontSize: 14,

    color: '#666',
  },
});
