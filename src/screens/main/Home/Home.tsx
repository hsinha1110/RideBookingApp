import React, { FC, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { PlaceItem } from '@/screens/types';

import { NavigationProp } from '@/components/types';

import {
  getAddressFromLatLng,
  getAddressFromPlaceId,
  getCurrentLocation,
  watchCurrentLocation,
  clearLocationWatcher,
} from '@/utils/services';

//================================================
// SCREEN
//================================================

const Home: FC = () => {
  //================================================
  // REFS
  //================================================

  const mapRef = useRef<MapView>(null);

  const watchIdRef = useRef<any>(null);

  //================================================
  // NAVIGATION
  //================================================

  const navigation = useNavigation<NavigationProp>();

  //================================================
  // STATES
  //================================================

  const [loading, setLoading] = useState(true);

  const [pickupAddress, setPickupAddress] = useState('');

  const [destination, setDestination] = useState('');

  const [places, setPlaces] = useState<PlaceItem[]>([]);

  const [region, setRegion] = useState<Region | null>(null);

  //================================================
  // INITIAL LOCATION
  //================================================

  useEffect(() => {
    getInitialLocation();

    return () => {
      if (watchIdRef.current !== null) {
        clearLocationWatcher(watchIdRef.current);
      }
    };
  }, []);

  //================================================
  // GET INITIAL LOCATION
  //================================================

  const getInitialLocation = async () => {
    try {
      setLoading(true);

      const coords = await getCurrentLocation();

      const newRegion: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);

      setTimeout(() => {
        mapRef.current?.animateToRegion(newRegion, 1000);
      }, 500);

      const response = await getAddressFromLatLng(
        coords.latitude,
        coords.longitude,
      );

      if (response?.formatted_address) {
        setPickupAddress(response.formatted_address);
      }

      // START LIVE LOCATION
      startLiveLocation();
    } catch (error) {
      console.log(error, '======= INITIAL LOCATION ERROR =======');
    } finally {
      setLoading(false);
    }
  };

  //================================================
  // LIVE LOCATION
  //================================================

  const startLiveLocation = () => {
    watchIdRef.current = watchCurrentLocation(async coords => {
      try {
        const newRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        // FIRST TIME ONLY
        if (!region) {
          setRegion(newRegion);
        }

        mapRef.current?.animateCamera(
          {
            center: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            zoom: 16,
          },
          { duration: 1000 },
        );

        const response = await getAddressFromLatLng(
          coords.latitude,
          coords.longitude,
        );

        if (response?.formatted_address) {
          setPickupAddress(response.formatted_address);
        }

        setLoading(false);
      } catch (error) {
        console.log(error, '======= LIVE LOCATION ERROR =======');

        setLoading(false);
      }
    });
  };

  //================================================
  // SELECT PLACE
  //================================================

  const handleSelectPlace = async (item: PlaceItem) => {
    try {
      const details = await getAddressFromPlaceId(item.place_id);

      const location = details?.geometry?.location;

      if (!location) {
        return;
      }

      const newRegion: Region = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(newRegion);

      mapRef.current?.animateToRegion(newRegion, 1000);

      setDestination(item.description);

      setPlaces([]);
    } catch (error) {
      console.log(error, '======= PLACE ERROR =======');
    }
  };

  //================================================
  // LOADER
  //================================================

  if (loading || !region) {
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
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Current Location"
          description={pickupAddress}
        />
      </MapView>

      {/*================================================
        BOTTOM CARD
      =================================================*/}

      <View style={styles.bottomCard}>
        <View style={styles.dragLine} />

        <Text style={styles.title}>Find a Ride</Text>

        {/* PICKUP */}

        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={20} color="#000" />

          <TextInput
            value={pickupAddress}
            editable={false}
            placeholder="Pickup Location"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>

        {/* DESTINATION */}

        <Pressable
          style={styles.inputContainer}
          onPress={() => {
            navigation.navigate('SearchScreen', {
              location: {
                latitude: region.latitude,
                longitude: region.longitude,
              },

              pickupAddress,
            });
          }}
        >
          <Icon name="navigate" size={20} color="#000" />

          <TextInput
            value={destination}
            editable={false}
            pointerEvents="none"
            placeholder="Enter Destination"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;

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

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },

  inputContainer: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: '#000',
    fontSize: 15,
  },
});
