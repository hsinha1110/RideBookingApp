import React, { FC, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import {
  acceptRejectAsyncThunk,
  updateDriverLocationAsyncThunk,
} from '@/redux/thunk/thunk';

import { AppDispatch, RootState } from '@/redux/store';

import {
  getAddressFromLatLng,
  watchCurrentLocation,
  clearLocationWatcher,
} from '@/utils/services';

import socket, { connectSocket } from '@/utils/socket';

import { moderateScale } from '@/styles/scaling';

//================================================
// GOOGLE API
//================================================

const GOOGLE_MAP_KEY = 'YOUR_GOOGLE_MAP_KEY';

//================================================
// SCREEN
//================================================

const DriverHomeScreen: FC = () => {
  //================================================
  // REFS
  //================================================

  const watchIdRef = useRef<any>(null);

  //================================================
  // NAVIGATION
  //================================================

  const navigation = useNavigation<any>();

  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  const driverId = useSelector((state: RootState) => state.auth.riderId);

  //================================================
  // STATES
  //================================================

  const [isOnline, setIsOnline] = useState(false);

  const [isRideStarted, setIsRideStarted] = useState(false);

  const [currentLocation, setCurrentLocation] = useState('');

  const [rideRequest, setRideRequest] = useState<any>(null);

  const [region, setRegion] = useState<any>(null);

  //================================================
  // START LIVE LOCATION
  //================================================

  useEffect(() => {
    startLiveTracking();

    return () => {
      if (watchIdRef.current !== null) {
        clearLocationWatcher(watchIdRef.current);
      }
    };
  }, []);

  //================================================
  // SOCKET CONNECTION
  //================================================

  useEffect(() => {
    if (!isOnline) {
      socket.disconnect();

      socket.off('new_ride_request');

      return;
    }

    initializeSocket();

    return () => {
      socket.off('connect');

      socket.off('connect_error');

      socket.off('new_ride_request');

      socket.off('rideCancelledByRider');

      socket.disconnect();
    };
  }, [isOnline]);

  //================================================
  // START LIVE TRACKING
  //================================================

  const startLiveTracking = () => {
    watchIdRef.current = watchCurrentLocation(async coords => {
      const latitude = coords.latitude;

      const longitude = coords.longitude;

      setRegion({
        latitude,

        longitude,

        latitudeDelta: 0.01,

        longitudeDelta: 0.01,
      });

      const response = await getAddressFromLatLng(latitude, longitude);

      if (response?.formatted_address) {
        setCurrentLocation(response.formatted_address);
      }
    });
  };

  //================================================
  // SOCKET INITIALIZE
  //================================================

  const initializeSocket = async () => {
    try {
      await connectSocket();

      //================================================
      // CONNECT
      //================================================

      socket.off('connect');

      socket.on('connect', () => {
        console.log('======= DRIVER SOCKET CONNECTED =======');
      });

      //================================================
      // ERROR
      //================================================

      socket.off('connect_error');

      socket.on('connect_error', (error: any) => {
        console.log(error.message, '======= SOCKET ERROR =======');
      });

      //================================================
      // NEW RIDE
      //================================================

      socket.off('new_ride_request');

      socket.on('new_ride_request', (ride: any) => {
        console.log(ride, '======= NEW RIDE RECEIVED =======');

        setRideRequest(ride);

        setIsRideStarted(false);
      });

      //================================================
      // RIDER CANCELLED
      //================================================

      socket.off('rideCancelledByRider');

      socket.on('rideCancelledByRider', (data: any) => {
        console.log(data, '======= RIDER CANCELLED =======');

        setRideRequest(null);

        setIsRideStarted(false);
      });
    } catch (error) {
      console.log(error, '======= SOCKET INIT ERROR =======');
    }
  };

  //================================================
  // ACCEPT / REJECT
  //================================================

  const handleRideAction = async (action: 'accepted' | 'cancelled') => {
    try {
      if (!rideRequest?._id) {
        return;
      }

      const payload = {
        rideId: rideRequest._id,

        status: action,
      };

      await dispatch(acceptRejectAsyncThunk(payload)).unwrap();

      //================================================
      // ACCEPTED
      //================================================

      if (action === 'accepted') {
        socket.emit('join_ride', rideRequest._id);

        setRideRequest((prev: any) => ({
          ...prev,

          status: 'accepted',
        }));
      }

      //================================================
      // CANCELLED
      //================================================

      if (action === 'cancelled') {
        setRideRequest(null);

        setIsRideStarted(false);
      }
    } catch (error) {
      console.log(error, '======= RIDE ACTION ERROR =======');
    }
  };

  //================================================
  // CHAT
  //================================================

  const handleChat = () => {
    navigation.navigate('Chat', {
      rideId: rideRequest?._id,
    });
  };

  //================================================
  // LOADER
  //================================================

  if (!region) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  //================================================
  // UI
  //================================================

  return (
    <SafeAreaView style={styles.container}>
      {/*================================================
        MAP
      =================================================*/}

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/*================================================
          ROUTE
        =================================================*/}

        {rideRequest?.pickupLocation && rideRequest?.destinationLocation && (
          <MapViewDirections
            origin={{
              latitude: Number(rideRequest?.pickupLocation?.latitude || 0),

              longitude: Number(rideRequest?.pickupLocation?.longitude || 0),
            }}
            destination={{
              latitude: Number(rideRequest?.destinationLocation?.latitude || 0),

              longitude: Number(
                rideRequest?.destinationLocation?.longitude || 0,
              ),
            }}
            apikey={GOOGLE_MAP_KEY}
            strokeWidth={5}
            strokeColor="black"
          />
        )}
      </MapView>

      {/*================================================
        TOP CARD
      =================================================*/}

      <View style={styles.topCard}>
        <View>
          <Text style={styles.onlineTitle}>
            {isOnline ? 'You are online' : 'You are offline'}
          </Text>

          <Text style={styles.onlineSubTitle}>
            {isOnline
              ? 'You can receive rides now'
              : 'Go online to receive rides'}
          </Text>
        </View>

        <Switch
          value={isOnline}
          onValueChange={async value => {
            setIsOnline(value);

            if (value && driverId && region) {
              try {
                await dispatch(
                  updateDriverLocationAsyncThunk({
                    driverId,

                    lat: region.latitude,

                    lng: region.longitude,

                    heading: 0,
                  }),
                ).unwrap();
              } catch (error) {
                console.log(error, '======= UPDATE LOCATION ERROR =======');
              }
            }
          }}
        />
      </View>

      {/*================================================
        CURRENT LOCATION CARD
      =================================================*/}

      <View style={styles.currentLocationCard}>
        <Text style={styles.currentLocationLabel}>Current Location</Text>

        <Text style={styles.currentLocationText}>
          {currentLocation || 'Fetching current location...'}
        </Text>
      </View>

      {/*================================================
        RIDE CARD
      =================================================*/}

      {isOnline && rideRequest && (
        <View style={styles.bottomCard}>
          <View style={styles.dragLine} />

          {/*================================================
            PENDING
          =================================================*/}

          {rideRequest?.status === 'pending' && (
            <>
              <Text style={styles.title}>New Ride Request</Text>

              <View style={styles.rideCard}>
                <Text style={styles.userName}>
                  {rideRequest?.rider?.fullName || 'Rider'}
                </Text>

                <Text style={styles.label}>Pickup</Text>

                <Text style={styles.address}>
                  {rideRequest?.pickupLocation?.address}
                </Text>

                <Text style={styles.label}>Destination</Text>

                <Text style={styles.address}>
                  {rideRequest?.destinationLocation?.address}
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleRideAction('cancelled')}
                    style={styles.rejectBtn}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRideAction('accepted')}
                    style={styles.acceptBtn}
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/*================================================
            ACCEPTED
          =================================================*/}

          {rideRequest?.status === 'accepted' && (
            <>
              <Text style={styles.title}>Driver is coming</Text>

              <View style={styles.rideCard}>
                <Text style={styles.userName}>
                  {rideRequest?.rider?.fullName}
                </Text>

                <Text style={styles.address}>
                  {rideRequest?.pickupLocation?.address}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    socket.emit('rideStarted', {
                      rideId: rideRequest?._id,
                    });

                    setIsRideStarted(true);

                    setRideRequest((prev: any) => ({
                      ...prev,

                      status: 'ongoing',
                    }));
                  }}
                  style={styles.acceptBtn}
                >
                  <Text style={styles.btnText}>Start Ride</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/*================================================
            ONGOING
          =================================================*/}

          {rideRequest?.status === 'ongoing' && (
            <>
              <Text style={styles.title}>Ride In Progress</Text>

              <View style={styles.rideCard}>
                <Text style={styles.userName}>
                  {rideRequest?.rider?.fullName}
                </Text>

                <Text style={styles.address}>
                  {rideRequest?.destinationLocation?.address}
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleChat}
                    style={styles.rejectBtn}
                  >
                    <Text style={styles.btnText}>Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      socket.emit('rideCompleted', {
                        rideId: rideRequest?._id,
                      });

                      setRideRequest(null);

                      setIsRideStarted(false);
                    }}
                    style={styles.acceptBtn}
                  >
                    <Text style={styles.btnText}>Complete Ride</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default DriverHomeScreen;

//================================================
// STYLES
//================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  map: {
    flex: 1,
  },

  topCard: {
    position: 'absolute',

    top: moderateScale(80),

    left: 20,

    right: 20,

    backgroundColor: '#fff',

    borderRadius: 20,

    padding: 16,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    elevation: 5,
  },

  onlineTitle: {
    fontSize: 18,

    fontWeight: '700',

    color: '#000',
  },

  onlineSubTitle: {
    fontSize: 13,

    color: '#666',

    marginTop: 4,
  },

  currentLocationCard: {
    position: 'absolute',

    top: moderateScale(170),

    left: 20,

    right: 20,

    backgroundColor: '#fff',

    borderRadius: 18,

    padding: 16,

    elevation: 5,
  },

  currentLocationLabel: {
    fontSize: 13,

    color: '#777',

    marginBottom: 6,
  },

  currentLocationText: {
    fontSize: 15,

    fontWeight: '600',

    color: '#000',
  },

  bottomCard: {
    position: 'absolute',

    bottom: 0,

    width: '100%',

    backgroundColor: '#fff',

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    paddingHorizontal: 20,

    paddingTop: 16,

    paddingBottom: 30,

    elevation: 10,
  },

  dragLine: {
    width: 50,

    height: 5,

    borderRadius: 10,

    backgroundColor: '#D9D9D9',

    alignSelf: 'center',

    marginBottom: 18,
  },

  title: {
    fontSize: 24,

    fontWeight: '700',

    color: '#000',

    marginBottom: 20,
  },

  rideCard: {
    backgroundColor: '#F8F8F8',

    borderRadius: 18,

    padding: 18,
  },

  userName: {
    fontSize: 20,

    fontWeight: '700',

    color: '#000',

    marginBottom: 16,
  },

  label: {
    fontSize: 13,

    color: '#777',

    marginBottom: 4,
  },

  address: {
    fontSize: 15,

    color: '#222',

    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: 'row',
  },

  acceptBtn: {
    flex: 1,

    backgroundColor: 'green',

    paddingVertical: 14,

    borderRadius: 14,

    alignItems: 'center',

    marginLeft: 8,
  },

  rejectBtn: {
    flex: 1,

    backgroundColor: '#222',

    paddingVertical: 14,

    borderRadius: 14,

    alignItems: 'center',

    marginRight: 8,
  },

  btnText: {
    color: '#fff',

    fontWeight: '700',

    fontSize: 15,
  },
});
