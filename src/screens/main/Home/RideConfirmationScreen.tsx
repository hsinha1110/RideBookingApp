import React, { FC, useEffect, useState } from 'react';

import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/redux/store';

import { requestRideAsyncThunk } from '@/redux/thunk/thunk';

import socket, { connectSocket } from '@/utils/socket';

import { getAddressFromLatLng, getCurrentLocation } from '@/utils/services';

//================================================
// GOOGLE MAP KEY
//================================================

const GOOGLE_MAPS_API_KEY = 'AIzaSyBSrX-LTpLpIuYgJSS6G0pUfQl6Q-B0y7Y';

//================================================
// SCREEN
//================================================

const RideConfirmationScreen: FC = () => {
  //================================================
  // ROUTE
  //================================================

  const route = useRoute<any>();

  const { pickupLocation, destination, destinationCoords } = route.params || {};

  const navigation = useNavigation<any>();

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // STATES
  //================================================

  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState('searching');
  const [currentLocation, setCurrentLocation] = useState(
    pickupLocation?.address || pickupLocation || 'Current Location',
  );

  const [region, setRegion] = useState({
    latitude: 22.7196,

    longitude: 75.8577,

    latitudeDelta: 0.05,

    longitudeDelta: 0.05,
  });

  const [origin, setOrigin] = useState({
    latitude: 22.71353,

    longitude: 75.868855,
  });

  //================================================
  // GET LOCATION
  //================================================

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        //================================================
        // PICKUP ALREADY AVAILABLE
        //================================================

        if (pickupLocation?.latitude && pickupLocation?.longitude) {
          setOrigin({
            latitude: pickupLocation.latitude,

            longitude: pickupLocation.longitude,
          });

          setRegion({
            latitude: pickupLocation.latitude,

            longitude: pickupLocation.longitude,

            latitudeDelta: 0.05,

            longitudeDelta: 0.05,
          });

          if (pickupLocation?.address) {
            setCurrentLocation(pickupLocation.address);
          }

          return;
        }

        //================================================
        // CURRENT GPS
        //================================================

        const coords = await getCurrentLocation();

        //================================================
        // UPDATE ORIGIN
        //================================================

        setOrigin({
          latitude: coords.latitude,

          longitude: coords.longitude,
        });

        //================================================
        // REGION
        //================================================

        setRegion({
          latitude: coords.latitude,

          longitude: coords.longitude,

          latitudeDelta: 0.05,

          longitudeDelta: 0.05,
        });

        //================================================
        // ADDRESS
        //================================================

        const response = await getAddressFromLatLng(
          coords.latitude,
          coords.longitude,
        );

        console.log(response, '======= ADDRESS RESPONSE =======');

        if (response?.formatted_address) {
          setCurrentLocation(response.formatted_address);
        }
      } catch (error) {
        console.log(error, '======= LOCATION ERROR =======');
      }
    };

    fetchLocation();
  }, []);

  //================================================
  // CONNECT SOCKET
  //================================================

  useEffect(() => {
    connectSocket();
  }, []);

  //================================================
  // SOCKET LISTENERS
  //================================================

  useEffect(() => {
    // CONNECT

    socket.on('connect', () => {
      console.log('RIDER SOCKET CONNECTED');
    });

    // ERROR

    socket.on('connect_error', (error: any) => {
      console.log(error.message, 'SOCKET ERROR');
    });

    //================================================
    // RIDE ACCEPTED
    //================================================

    socket.on('rideAccepted', (data: any) => {
      console.log(data, '======= RIDE ACCEPTED =======');

      setRideStatus('accepted');

      navigation.navigate('RideDetailsScreen', {
        pickupLocation: {
          latitude: Number(origin.latitude),

          longitude: Number(origin.longitude),

          address: currentLocation,
        },

        destinationLocation: {
          latitude: Number(destinationCoords?.latitude),

          longitude: Number(destinationCoords?.longitude),

          address: destination,
        },

        rideId: data?.rideId,
      });
    });

    socket.on('rideStarted', () => {
      console.log('======= RIDE STARTED =======');

      setRideStatus('ongoing');
    });

    socket.on('rideCompleted', () => {
      console.log('======= RIDE COMPLETED =======');

      setRideStatus('completed');

      Alert.alert('Ride Completed');
    });

    socket.on('rideCancelled', () => {
      Alert.alert('Ride Cancelled');

      navigation.goBack();
    });
    socket.on('rideCancelled', (data: any) => {
      console.log(data, '======= RIDE CANCELLED =======');

      Alert.alert('Ride Cancelled', 'Driver rejected your ride request');
      navigation.goBack();
    });
    // CLEANUP

    return () => {
      socket.off('connect');

      socket.off('connect_error');

      socket.off('rideAccepted');

      socket.off('rideCancelled');
    };
  }, [currentLocation, origin, destination, destinationCoords]);

  //================================================
  // REQUEST RIDE
  //================================================

  const handleRequestRide = async () => {
    try {
      setLoading(true);

      //================================================
      // PAYLOAD
      //================================================

      const payload = {
        pickup: {
          latitude: origin.latitude,

          longitude: origin.longitude,

          description: currentLocation,

          place_id: 'pickup_123',

          name: currentLocation,
        },

        destination: {
          latitude: destinationCoords.latitude,

          longitude: destinationCoords.longitude,

          description: destination,

          place_id: 'destination_123',

          name: destination,
        },
      };

      console.log(payload, '======= REQUEST RIDE PAYLOAD =======');

      //================================================
      // API
      //================================================

      const response = await dispatch(requestRideAsyncThunk(payload)).unwrap();

      console.log(response, '======= REQUEST RIDE SUCCESS =======');

      Alert.alert('Searching', 'Searching for drivers...');
    } catch (error: any) {
      console.log(error, '======= REQUEST RIDE ERROR =======');

      Alert.alert(
        'Error',
        typeof error === 'string'
          ? error
          : error?.message || 'Ride request failed',
      );
    } finally {
      setLoading(false);
    }
  };

  //================================================
  // UI
  //================================================

  return (
    <View style={styles.container}>
      {/* MAP */}

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
      >
        {/* PICKUP */}

        <Marker
          coordinate={origin}
          title="Pickup"
          description={currentLocation}
        />

        {/* DESTINATION */}

        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            pinColor="green"
            title="Destination"
            description={destination}
          />
        )}

        {/* ROUTE */}

        {destinationCoords && (
          <MapViewDirections
            origin={origin}
            destination={destinationCoords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="#000"
          />
        )}
      </MapView>

      {/* CARD */}

      <View style={styles.bottomCard}>
        <Text style={styles.title}>{destination}</Text>

        <Text style={styles.address}>{currentLocation}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRequestRide}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Requesting...' : 'Confirm Ride'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideConfirmationScreen;

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

  bottomCard: {
    position: 'absolute',

    bottom: 30,

    left: 20,

    right: 20,

    backgroundColor: '#fff',

    borderRadius: 20,

    padding: 20,

    elevation: 5,
  },

  title: {
    fontSize: 18,

    fontWeight: '700',

    color: '#000',

    marginBottom: 10,
  },

  address: {
    fontSize: 14,

    color: '#666',

    marginBottom: 20,
  },

  button: {
    height: 55,

    backgroundColor: '#000',

    justifyContent: 'center',

    alignItems: 'center',

    borderRadius: 14,
  },

  buttonText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '700',
  },
});
