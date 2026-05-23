import { Alert, Platform } from 'react-native';

import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

//================================================
// LOCATION PERMISSION
//================================================

export const requestLocationPermission = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    return await handleSinglePermission(permission, 'Location');
  } catch (error) {
    console.log(error, '======= LOCATION PERMISSION ERROR =======');

    return false;
  }
};

//================================================
// CAMERA PERMISSION
//================================================

export const requestCameraPermission = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    return await handleSinglePermission(permission, 'Camera');
  } catch (error) {
    console.log(error, '======= CAMERA PERMISSION ERROR =======');

    return false;
  }
};

//================================================
// GALLERY PERMISSION
//================================================

export const requestGalleryPermission = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    return await handleSinglePermission(permission, 'Gallery');
  } catch (error) {
    console.log(error, '======= GALLERY PERMISSION ERROR =======');

    return false;
  }
};

//================================================
// ANDROID MULTIPLE PERMISSIONS
//================================================

export const requestAllAndroidPermissions = async () => {
  try {
    //==========================================
    // IOS
    //==========================================

    if (Platform.OS === 'ios') {
      return true;
    }

    //==========================================
    // ANDROID PERMISSIONS
    //==========================================

    const permissions =
      Platform.Version >= 33
        ? [
            PERMISSIONS.ANDROID.CAMERA,

            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,

            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          ]
        : [
            PERMISSIONS.ANDROID.CAMERA,

            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,

            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ];

    //==========================================
    // REQUEST MULTIPLE
    //==========================================

    const results = await requestMultiple(permissions);

    console.log(results, '======= MULTIPLE PERMISSIONS =======');

    const allGranted = Object.values(results).every(
      result => result === RESULTS.GRANTED,
    );

    if (!allGranted) {
      Alert.alert(
        'Permissions Required',
        'Please allow all permissions to continue',
      );
    }

    return allGranted;
  } catch (error) {
    console.log(error, '======= MULTIPLE PERMISSION ERROR =======');

    return false;
  }
};

//================================================
// HANDLE SINGLE PERMISSION
//================================================

const handleSinglePermission = async (permission: any, type: string) => {
  const result = await check(permission);

  //==========================================
  // GRANTED
  //==========================================

  if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
    return true;
  }

  //==========================================
  // DENIED
  //==========================================

  if (result === RESULTS.DENIED) {
    const requestResult = await request(permission);

    return (
      requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED
    );
  }

  //==========================================
  // BLOCKED
  //==========================================

  if (result === RESULTS.BLOCKED) {
    showPermissionAlert(type);

    return false;
  }

  return false;
};

//================================================
// COMMON ALERT
//================================================

const showPermissionAlert = (type: string) => {
  Alert.alert(
    `${type} Permission`,
    `Please enable ${type.toLowerCase()} permission from settings`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: async () => {
          await openSettings();
        },
      },
    ],
  );
};
