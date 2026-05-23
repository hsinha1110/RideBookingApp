import React, { useEffect, useRef, useState } from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import { useNavigation, useRoute } from '@react-navigation/native';

import socket from '@/utils/socket';

import { scale } from '@/styles/scaling';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBSrX-LTpLpIuYgJSS6G0pUfQl6Q-B0y7Y';

const RideDetailsScreen = () => {
  const route = useRoute<any>();

  const { pickupLocation, destinationLocation, rideId } = route.params;

  const navigation = useNavigation<any>();

  const mapRef = useRef<MapView>(null);

  const [rideStatus, setRideStatus] = useState('Ride In Progress');

  //================================================
  // DRIVER LOCATION
  //================================================

  const [driverLocation, setDriverLocation] = useState({
    latitude: pickupLocation.latitude,

    longitude: pickupLocation.longitude,
  });

  //================================================
  // CAR ROTATION
  //================================================

  const [carHeading, setCarHeading] = useState(0);

  //================================================
  // JOIN RIDE ROOM
  //================================================

  useEffect(() => {
    if (rideId) {
      socket.emit('join_ride', rideId);
    }
  }, [rideId]);

  //================================================
  // DRIVER LOCATION UPDATE
  //================================================

  useEffect(() => {
    socket.off('driverLocationUpdated');

    socket.on('driverLocationUpdated', data => {
      if (data.rideId !== rideId) {
        return;
      }

      const latitude = Number(data.latitude);

      const longitude = Number(data.longitude);

      //========================================
      // UPDATE DRIVER LOCATION
      //========================================

      setDriverLocation({
        latitude,

        longitude,
      });

      //========================================
      // UPDATE HEADING
      //========================================

      if (typeof data.heading === 'number') {
        setCarHeading(data.heading);
      }

      //========================================
      // CAMERA FOLLOW
      //========================================

      mapRef.current?.animateCamera(
        {
          center: {
            latitude,

            longitude,
          },

          zoom: 16,
        },
        {
          duration: 1000,
        },
      );
    });

    return () => {
      socket.off('driverLocationUpdated');
    };
  }, [rideId]);

  //================================================
  // RIDE STARTED
  //================================================

  useEffect(() => {
    socket.off('rideStarted');

    socket.on('rideStarted', data => {
      if (data.rideId !== rideId) {
        return;
      }

      setRideStatus('Ride In Progress');
    });

    return () => {
      socket.off('rideStarted');
    };
  }, [rideId]);

  //================================================
  // RIDE COMPLETED
  //================================================

  useEffect(() => {
    socket.off('rideCompleted');

    socket.on('rideCompleted', data => {
      if (data.rideId !== rideId) {
        return;
      }

      setRideStatus('Ride Completed');
    });

    return () => {
      socket.off('rideCompleted');
    };
  }, [rideId]);

  //================================================
  // CHAT
  //================================================

  const handleChat = () => {
    navigation.navigate('Chat', {
      rideId,
    });
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

          latitudeDelta: 0.03,

          longitudeDelta: 0.03,
        }}
      >
        {/*================================================
          ROUTE
        =================================================*/}

        <MapViewDirections
          origin={{
            latitude: pickupLocation.latitude,

            longitude: pickupLocation.longitude,
          }}
          destination={{
            latitude: destinationLocation.latitude,

            longitude: destinationLocation.longitude,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={6}
          strokeColor="#000"
          optimizeWaypoints
        />

        {/*================================================
          PICKUP MARKER
        =================================================*/}

        <Marker
          coordinate={{
            latitude: pickupLocation.latitude,

            longitude: pickupLocation.longitude,
          }}
          title="Pickup"
        />

        {/*================================================
          DESTINATION MARKER
        =================================================*/}

        <Marker
          coordinate={{
            latitude: destinationLocation.latitude,

            longitude: destinationLocation.longitude,
          }}
          pinColor="green"
          title="Destination"
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
          rotation={carHeading}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png',
            }}
            style={{
              width: 42,

              height: 42,

              resizeMode: 'contain',
            }}
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
        <View style={styles.driverRow}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            style={styles.driverImage}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>Kevin</Text>

            <Text style={styles.carDetails}>Swift Dzire • MP09AB1234</Text>
          </View>

          <TouchableOpacity onPress={handleChat} style={styles.chatButton}>
            <Text style={styles.chatText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup</Text>

          <Text style={styles.infoValue}>{pickupLocation.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Destination</Text>

          <Text style={styles.infoValue}>{destinationLocation.address}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusContainerText}>{rideStatus}</Text>
        </View>
      </View>
    </View>
  );
};

export default RideDetailsScreen;

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

  statusContainer: {
    backgroundColor: '#000',

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 10,
  },

  statusContainerText: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '700',
  },
});
