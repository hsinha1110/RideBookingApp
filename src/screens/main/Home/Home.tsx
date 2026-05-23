import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { NavigationProp } from '@/components/types';

import {
  getAddressFromLatLng,
  getCurrentLocation,
} from '@/utils/services';

//================================================
// SCREEN
//================================================

const Home: FC = () => {

  //================================================
  // REFS
  //================================================

  const mapRef =
    useRef<MapView>(null);

  //================================================
  // NAVIGATION
  //================================================

  const navigation =
    useNavigation<NavigationProp>();

  //================================================
  // STATES
  //================================================

  const [loading, setLoading] =
    useState(true);

  const [pickupAddress,
    setPickupAddress] =
    useState('');

  const [destination,
    setDestination] =
    useState('');

  const [region, setRegion] =
    useState<Region | null>(
      null,
    );

  //================================================
  // INITIAL LOCATION
  //================================================

  useEffect(() => {
    getInitialLocation();
  }, []);

  //================================================
  // GET INITIAL LOCATION
  //================================================

  const getInitialLocation =
    async () => {

      try {

        setLoading(true);

        //============================================
        // CURRENT LOCATION
        //============================================

        const coords =
          await getCurrentLocation();

        const newRegion: Region =
          {
            latitude:
              coords.latitude,

            longitude:
              coords.longitude,

            latitudeDelta:
              0.01,

            longitudeDelta:
              0.01,
          };

        //============================================
        // SET REGION
        //============================================

        setRegion(newRegion);

        //============================================
        // ANIMATE MAP
        //============================================

        setTimeout(() => {

          mapRef.current?.animateToRegion(
            newRegion,
            1000,
          );

        }, 500);

        //============================================
        // GET ADDRESS
        //============================================

        const response =
          await getAddressFromLatLng(
            coords.latitude,
            coords.longitude,
          );

        if (
          response?.formatted_address
        ) {

          setPickupAddress(
            response.formatted_address,
          );
        }

      } catch (error) {

        console.log(
          error,
          '======= INITIAL LOCATION ERROR =======',
        );

      } finally {

        setLoading(false);
      }
    };

  //================================================
  // LOADER
  //================================================

  if (loading || !region) {

    return (
      <View
        style={
          styles.loaderContainer
        }>

        <ActivityIndicator
          size="large"
          color="black"
        />
      </View>
    );
  }

  //================================================
  // UI
  //================================================

  return (
    <SafeAreaView
      style={styles.container}>

      {/* MAP */}

      <MapView
        ref={mapRef}
        provider={
          Platform.OS ===
          'android'
            ? PROVIDER_GOOGLE
            : undefined
        }
        style={styles.map}
        initialRegion={region}
        showsMyLocationButton={
          true
        }>

        {/* MARKER */}

        <Marker
          coordinate={{
            latitude:
              region.latitude,

            longitude:
              region.longitude,
          }}
          title="Current Location"
          description={
            pickupAddress
          }
        />
      </MapView>

      {/*================================================
        BOTTOM CARD
      =================================================*/}

      <View
        style={
          styles.bottomCard
        }>

        {/* DRAG LINE */}

        <View
          style={
            styles.dragLine
          }
        />

        {/* TITLE */}

        <Text
          style={
            styles.title
          }>
          Find a Ride
        </Text>

        {/* PICKUP */}

        <View
          style={
            styles.inputContainer
          }>

          <Icon
            name="location-outline"
            size={20}
            color="#000"
          />

          <TextInput
            value={
              pickupAddress
            }
            editable={false}
            placeholder="Pickup Location"
            placeholderTextColor="#666"
            style={
              styles.input
            }
          />
        </View>

        {/* DESTINATION */}

        <Pressable
          style={
            styles.inputContainer
          }
          onPress={() => {

            navigation.navigate(
              'SearchScreen',
              {
                location: {
                  latitude:
                    region.latitude,

                  longitude:
                    region.longitude,
                },

                pickupAddress,
              },
            );
          }}>

          <Icon
            name="navigate"
            size={20}
            color="#000"
          />

          <TextInput
            value={destination}
            editable={false}
            pointerEvents="none"
            placeholder="Enter Destination"
            placeholderTextColor="#666"
            style={
              styles.input
            }
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

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    map: {
      flex: 1,
    },

    loaderContainer: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    bottomCard: {
      position:
        'absolute',

      bottom: 0,

      width: '100%',

      backgroundColor:
        '#fff',

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

      backgroundColor:
        '#D9D9D9',

      alignSelf:
        'center',

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

      backgroundColor:
        '#F5F5F5',

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