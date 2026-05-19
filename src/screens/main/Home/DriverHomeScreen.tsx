import React, { FC, useEffect, useRef, useState } from 'react';

import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { SafeAreaView } from 'react-native-safe-area-context';

import MapViewDirections from 'react-native-maps-directions';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/redux/store';

import { acceptRejectAsyncThunk } from '@/redux/thunk/thunk';

import { getAddressFromLatLng, getCurrentLocation } from '@/utils/services';

import socket, { connectSocket } from '@/utils/socket';

import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
//================================================
// GOOGLE API
//================================================

const GOOGLE_MAPS_API_KEY = 'AIzaSyCB2sqGXzDeqvTrGp72iOa8fAuS1lPTNzI';

//================================================
// SCREEN
//================================================

const DriverHomeScreen: FC = () => {
  //================================================
  // REFS
  //================================================

  const intervalRef = useRef<any>(null);

  //================================================
  // STATES
  //================================================

  const [isOnline, setIsOnline] = useState(false);

  const [isRideStarted, setIsRideStarted] = useState(false);

  const [currentLocation, setCurrentLocation] = useState('');

  const [rideRequest, setRideRequest] = useState<any>(null);
  const navigation = useNavigation<any>();
  const [region, setRegion] = useState({
    latitude: 22.7196,

    longitude: 75.8577,

    latitudeDelta: 0.01,

    longitudeDelta: 0.01,
  });

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // INITIAL LOCATION
  //================================================

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  //================================================
  // SOCKET CONNECTION
  //================================================

  useEffect(() => {
    if (!isOnline) {
      socket.disconnect();

      socket.off('new_ride_request');

      console.log('======= SOCKET OFF =======');

      return;
    }

    initializeSocket();

    return () => {
      socket.off('connect');

      socket.off('connect_error');

      socket.off('new_ride_request');

      socket.disconnect();

      console.log('======= SOCKET DISCONNECTED =======');
    };
  }, [isOnline]);

  //================================================
  // LIVE DRIVER LOCATION
  //================================================

  useEffect(() => {
    //================================================
    // ONLY START AFTER START RIDE
    //================================================

    if (!rideRequest?._id || !isOnline || !isRideStarted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

        intervalRef.current = null;

        console.log('======= INTERVAL STOPPED =======');
      }

      return;
    }

    //================================================
    // CLEAR OLD INTERVAL
    //================================================

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    //================================================
    // START INTERVAL
    //================================================

    intervalRef.current = setInterval(async () => {
      try {
        const coords = await getCurrentLocation();

        //================================================
        // UPDATE REGION
        //================================================

        setRegion({
          latitude: coords.latitude,

          longitude: coords.longitude,

          latitudeDelta: 0.01,

          longitudeDelta: 0.01,
        });

        //================================================
        // SOCKET EMIT
        //================================================

        socket.emit('driverLocationUpdate', {
          rideId: rideRequest._id,

          latitude: coords.latitude,

          longitude: coords.longitude,
        });

        console.log(
          {
            rideId: rideRequest._id,

            latitude: coords.latitude,

            longitude: coords.longitude,
          },
          '======= DRIVER LOCATION UPDATED =======',
        );
      } catch (error) {
        console.log(error, '======= DRIVER LOCATION ERROR =======');
      }
    }, 3000);

    //================================================
    // CLEANUP
    //================================================

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

        intervalRef.current = null;

        console.log('======= LOCATION INTERVAL CLEARED =======');
      }
    };
  }, [rideRequest, isOnline, isRideStarted]);

  //================================================
  // INITIALIZE SOCKET
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

        //================================================
        // RESET START STATE
        //================================================

        setIsRideStarted(false);
      });
    } catch (error) {
      console.log(error, '======= SOCKET INIT ERROR =======');
    }
  };

  //================================================
  // GET CURRENT LOCATION
  //================================================

  const getUserCurrentLocation = async () => {
    try {
      const coords = await getCurrentLocation();

      const latitude = coords.latitude;

      const longitude = coords.longitude;

      setRegion({
        latitude,

        longitude,

        latitudeDelta: 0.01,

        longitudeDelta: 0.01,
      });

      const response = await getAddressFromLatLng(latitude, longitude);

      const fullAddress = response?.formatted_address;

      if (fullAddress) {
        setCurrentLocation(fullAddress);
      }
    } catch (error) {
      console.log(error, '======= LOCATION ERROR =======');
    }
  };

  //================================================
  // ACCEPT / REJECT
  //================================================

  const handleRideAction = async (action: 'accepted' | 'rejected') => {
    try {
      if (!rideRequest?._id) {
        return;
      }

      const payload = {
        rideId: rideRequest._id,

        status: action,
      };

      console.log(payload, '======= RIDE ACTION PAYLOAD =======');

      const response: any = await dispatch(
        acceptRejectAsyncThunk(payload),
      ).unwrap();

      console.log(response, '======= RIDE ACTION RESPONSE =======');

      //================================================
      // ACCEPTED
      //================================================

      if (action === 'accepted') {
        socket.emit('join_ride', rideRequest._id);

        console.log('======= RIDE JOINED =======');
      }

      //================================================
      // REJECTED
      //================================================

      if (action === 'rejected') {
        setRideRequest(null);

        setIsRideStarted(false);
      }
    } catch (error) {
      console.log(error, '======= RIDE ACTION ERROR =======');
    }
  };

  //================================================
  // START RIDE
  //================================================

  const handleStartRide = () => {
    setIsRideStarted(true);

    console.log('======= RIDE STARTED =======');
  };

  //================================================
  // CANCEL RIDE
  //================================================

  const handleCancelRide = () => {
    //================================================
    // STOP INTERVAL
    //================================================

    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }

    //================================================
    // RESET STATES
    //================================================

    setIsRideStarted(false);

    setRideRequest(null);

    console.log('======= RIDE CANCELLED =======');
  };

  //================================================
  // UI
  //================================================
  const handleChat = () => {
    navigation.navigate('Chat', { rideId: rideRequest?._id });
  };
  //================================================
  // NAVIGATE TO CHAT WITH RIDE ID
  //================================================
  return (
    <SafeAreaView style={styles.container}>
      {/* MAP */}

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={true}
      >
        {/* ROUTE */}

        {rideRequest &&
          rideRequest?.pickupLocation &&
          rideRequest?.destinationLocation && (
            <MapViewDirections
              origin={{
                latitude: Number(rideRequest?.pickupLocation?.latitude || 0),

                longitude: Number(rideRequest?.pickupLocation?.longitude || 0),
              }}
              destination={{
                latitude: Number(
                  rideRequest?.destinationLocation?.latitude || 0,
                ),

                longitude: Number(
                  rideRequest?.destinationLocation?.longitude || 0,
                ),
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="black"
              optimizeWaypoints={true}
            />
          )}

        {/* DRIVER MARKER */}

        <Marker
          coordinate={{
            latitude: region.latitude,

            longitude: region.longitude,
          }}
        />
      </MapView>

      {/* TOP CARD */}

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
          onValueChange={value => {
            setIsOnline(value);
          }}
        />
      </View>

      {/* RIDE CARD */}

      {isOnline && rideRequest && (
        <View style={styles.bottomCard}>
          <View style={styles.dragLine} />

          <Text style={styles.title}>Available Ride</Text>

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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.fare}>₹{rideRequest?.fare || 0}</Text>
              <TouchableOpacity onPress={handleChat} style={styles.chatButton}>
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* BUTTONS */}

            <View style={styles.buttonRow}>
              {/* REJECT */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleRideAction('rejected');
                }}
                style={styles.rejectBtn}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>

              {/* ACCEPT */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleRideAction('accepted');
                }}
                style={styles.acceptBtn}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
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

  fare: {
    fontSize: 28,

    fontWeight: '700',

    color: 'green',

    marginTop: 5,

    marginBottom: 20,
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

    backgroundColor: 'red',

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
  chatButton: {
    backgroundColor: 'green',

    paddingHorizontal: 20,

    paddingVertical: 10,

    borderRadius: 50,
  },

  chatText: {
    color: '#fff',

    fontWeight: '700',
  },
});
