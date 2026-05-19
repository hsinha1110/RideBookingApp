import React, { useEffect, useRef, useState } from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useDispatch } from 'react-redux';

import socket from '@/utils/socket';

import { cancelRideAsyncThunk } from '@/redux/thunk/thunk';

import { AppDispatch } from '@/redux/store';
import { scale } from '@/styles/scaling';

//================================================
// GOOGLE API
//================================================

const GOOGLE_MAPS_API_KEY = 'AIzaSyCB2sqGXzDeqvTrGp72iOa8fAuS1lPTNzI';

//================================================
// SCREEN
//================================================

const RideDetailsScreen = () => {
  //================================================
  // ROUTE
  //================================================

  const route = useRoute<any>();

  const { pickupLocation, destinationLocation, rideId } = route.params;

  //================================================
  // REFS
  //================================================

  const mapRef = useRef<MapView>(null);

  const intervalRef = useRef<any>(null);
  const navigation = useNavigation<any>();
  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // STATES
  //================================================

  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const [isTracking, setIsTracking] = useState(false);

  const [rideEnded, setRideEnded] = useState(false);

  const [rideStatus, setRideStatus] = useState('Driver is coming');

  const [driverLocation, setDriverLocation] = useState({
    latitude: pickupLocation.latitude,

    longitude: pickupLocation.longitude,
  });

  //================================================
  // SOCKET START ONLY AFTER START RIDE
  //================================================

  //================================================
  // MOVE CAR
  //================================================

  useEffect(() => {
    if (routeCoordinates.length === 0 || !isTracking || rideEnded) {
      return;
    }

    let index = 0;

    //================================================
    // START MOVEMENT
    //================================================

    intervalRef.current = setInterval(() => {
      //================================================
      // ARRIVED
      //================================================

      if (index >= routeCoordinates.length) {
        //================================================
        // STOP INTERVAL
        //================================================

        clearInterval(intervalRef.current);

        //================================================
        // STOP SOCKET
        //================================================

        socket.off('driverLocationUpdated', handleDriverLocation);

        console.log('SOCKET STOPPED');

        //================================================
        // UPDATE STATES
        //================================================

        setRideStatus('Ride Completed');

        setIsTracking(false);

        setRideEnded(true);

        console.log('RIDE COMPLETED');

        return;
      }

      //================================================
      // CURRENT POINT
      //================================================

      const currentPoint = routeCoordinates[index];

      //================================================
      // UPDATE DRIVER LOCATION
      //================================================

      setDriverLocation({
        latitude: currentPoint.latitude,

        longitude: currentPoint.longitude,
      });

      index++;
    }, 300);

    //================================================
    // CLEANUP
    //================================================
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [routeCoordinates, isTracking, rideEnded]);

  //================================================
  // CANCEL RIDE
  //================================================
  const handleDriverLocation = (data: any) => {
    console.log(data, '======= DRIVER LOCATION UPDATED =======');

    //================================================
    // SAME RIDE CHECK
    //================================================

    if (data.rideId !== rideId) {
      return;
    }

    //================================================
    // UPDATE DRIVER LOCATION
    //================================================

    setDriverLocation({
      latitude: data.latitude,

      longitude: data.longitude,
    });
  };
  const handleCancelRide = async () => {
    try {
      //================================================
      // STOP MOVEMENT
      //================================================

      clearInterval(intervalRef.current);

      //================================================
      // STOP SOCKET
      //================================================

      socket.off('driverLocationUpdated', handleDriverLocation);

      //================================================
      // STOP TRACKING
      //================================================

      setIsTracking(false);

      setRideEnded(true);

      //================================================
      // API CALL
      //================================================

      await dispatch(
        cancelRideAsyncThunk({
          rideId,
        }),
      ).unwrap();

      //================================================
      // STATUS
      //================================================

      setRideStatus('Ride Cancelled');

      //================================================
      // RESET DRIVER
      //================================================

      setDriverLocation({
        latitude: pickupLocation.latitude,

        longitude: pickupLocation.longitude,
      });

      //================================================
      // RESET MAP
      //================================================

      mapRef.current?.animateToRegion(
        {
          latitude: pickupLocation.latitude,

          longitude: pickupLocation.longitude,

          latitudeDelta: 0.05,

          longitudeDelta: 0.05,
        },
        1000,
      );

      console.log('RIDE CANCELLED');
    } catch (error) {
      console.log(error, '======= CANCEL ERROR =======');
    }
  };

  //================================================
  // START RIDE
  //================================================

  const handleStartRide = () => {
    //================================================
    // ROUTE CHECK
    //================================================

    if (routeCoordinates.length === 0) {
      console.log('ROUTE NOT READY');

      return;
    }

    //================================================
    // RESET STATES
    //================================================

    setRideEnded(false);

    //================================================
    // START TRACKING
    //================================================

    setIsTracking(true);

    //================================================
    // RESET CAR TO PICKUP
    //================================================

    setDriverLocation({
      latitude: pickupLocation.latitude,

      longitude: pickupLocation.longitude,
    });

    //================================================
    // REMOVE OLD LISTENER
    //================================================

    socket.off('driverLocationUpdated', handleDriverLocation);
    //================================================
    // START SOCKET
    //================================================

    socket.on('driverLocationUpdated', handleDriverLocation);

    console.log('SOCKET STARTED');

    //================================================
    // STATUS
    //================================================

    setRideStatus('Ride Started');

    console.log('RIDE STARTED');
  };

  //================================================
  // UI
  //================================================
  const handleChat = () => {
    navigation.navigate('Chat', { rideId });
  };
  return (
    <View style={styles.container}>
      {/*================================================
        MAP
      =================================================*/}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: pickupLocation.latitude,

          longitude: pickupLocation.longitude,

          latitudeDelta: 0.05,

          longitudeDelta: 0.05,
        }}
      >
        {/*================================================
          POLYLINE
        =================================================*/}

        <MapViewDirections
          origin={{
            latitude: Number(pickupLocation.latitude),

            longitude: Number(pickupLocation.longitude),
          }}
          destination={{
            latitude: Number(destinationLocation.latitude),

            longitude: Number(destinationLocation.longitude),
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={6}
          strokeColor="#000"
          optimizeWaypoints
          mode="DRIVING"
          resetOnChange={false}
          onReady={result => {
            //================================================
            // SAVE ROUTE
            //================================================

            setRouteCoordinates(result.coordinates);

            //================================================
            // FIT MAP
            //================================================

            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: {
                top: 120,
                right: 50,
                bottom: 420,
                left: 50,
              },

              animated: false,
            });
          }}
          onError={error => {
            console.log(error, '======= MAP ERROR =======');
          }}
        />

        {/*================================================
          PICKUP
        =================================================*/}

        <Marker
          coordinate={{
            latitude: pickupLocation.latitude,

            longitude: pickupLocation.longitude,
          }}
          title="Pickup"
          description={pickupLocation.address}
        />

        {/*================================================
          DESTINATION
        =================================================*/}

        <Marker
          coordinate={{
            latitude: destinationLocation.latitude,

            longitude: destinationLocation.longitude,
          }}
          pinColor="green"
          title="Destination"
          description={destinationLocation.address}
        />

        {/*================================================
          DRIVER CAR
        =================================================*/}

        <Marker
          coordinate={{
            latitude: driverLocation.latitude,

            longitude: driverLocation.longitude,
          }}
          flat
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
            }}
            style={styles.carIcon}
          />
        </Marker>
      </MapView>

      {/*================================================
        TOP CARD
      =================================================*/}

      <View style={styles.topCard}>
        <Text style={styles.statusText}>{rideStatus}</Text>

        <Text style={styles.subText}>Live tracking enabled</Text>
      </View>

      {/*================================================
        BOTTOM CARD
      =================================================*/}

      <View style={styles.bottomCard}>
        {/* DRIVER */}

        <View style={styles.driverRow}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            style={styles.driverImage}
          />

          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.driverName}>Kevin</Text>

            <Text style={styles.carDetails}>Swift Dzire • MP09AB1234</Text>
          </View>

          <TouchableOpacity onPress={handleChat} style={styles.chatButton}>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        </View>

        {/* PICKUP */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup</Text>

          <Text style={styles.infoValue}>{pickupLocation.address}</Text>
        </View>

        {/* DESTINATION */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Destination</Text>

          <Text style={styles.infoValue}>{destinationLocation.address}</Text>
        </View>

        {/*================================================
          BUTTONS
        =================================================*/}

        <View style={styles.buttonRow}>
          {/* CANCEL */}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>

          {/* START */}

          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleStartRide}
          >
            <Text style={styles.buttonText}>Start Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RideDetailsScreen;

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

    top: 60,

    left: 20,

    right: 20,

    backgroundColor: '#fff',

    borderRadius: 20,

    padding: 18,

    elevation: 5,
  },

  statusText: {
    fontSize: 28,

    fontWeight: '700',

    color: '#000',
  },

  subText: {
    fontSize: 16,

    color: 'gray',

    marginTop: 5,
  },

  bottomCard: {
    position: 'absolute',

    bottom: 0,

    left: 0,

    right: 0,

    backgroundColor: '#fff',

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    padding: 20,

    elevation: 10,
  },

  driverRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 20,
  },

  driverImage: {
    width: 70,

    height: 70,

    borderRadius: 35,

    marginRight: 15,
  },

  driverName: {
    fontSize: 24,

    fontWeight: '700',

    color: '#000',
  },

  carDetails: {
    fontSize: 16,

    color: 'gray',

    marginTop: 4,
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

  infoRow: {
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: scale(14),

    color: 'gray',
  },

  infoValue: {
    fontSize: 12,

    fontWeight: '600',

    color: '#000',

    marginTop: 5,
  },

  buttonRow: {
    flexDirection: 'row',

    marginTop: 20,
  },

  cancelButton: {
    flex: 1,

    backgroundColor: '#ff3b30',

    paddingVertical: 18,

    borderRadius: 16,

    alignItems: 'center',

    marginRight: 10,
  },

  trackButton: {
    flex: 1,

    backgroundColor: '#000',

    paddingVertical: 18,

    borderRadius: 16,

    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',

    fontWeight: '700',

    fontSize: 16,
  },

  carIcon: {
    width: 45,

    height: 45,

    resizeMode: 'contain',
  },
});
