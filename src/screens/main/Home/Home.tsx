import React, { FC, useEffect, useRef, useState } from 'react';

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, PlaceItem } from '@/screens/types';

import {
  getCurrentLocation,
  getAddressFromLatLng,
  searchAddress,
  getAddressFromPlaceId,
} from '@/utils/services';

const Home: FC = () => {
  const [currentLocation, setCurrentLocation] = useState('');

  const [region, setRegion] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [destination, setDestination] = useState('');

  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  const getUserCurrentLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      console.log('COORDS =>', coords);
      const latitude = coords.latitude;
      const longitude = coords.longitude;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      const response = await getAddressFromLatLng(latitude, longitude);
      console.log('ADDRESS RESPONSE =>', response);
      const fullAddress = response?.formatted_address;
      if (fullAddress) {
        setCurrentLocation(fullAddress);
      } else {
        setCurrentLocation(`${latitude}, ${longitude}`);
      }
    } catch (error) {
      console.log('LOCATION ERROR =>', error);
    }
  };

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
      console.log('PLACE SELECT ERROR:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Current Location"
          description={currentLocation}
        />
      </MapView>

      {/* SEARCH LIST */}

      {places.length > 0 && (
        <View style={styles.searchContainer}>
          <FlatList
            data={places}
            keyExtractor={item => item.place_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                activeOpacity={0.8}
                onPress={() => handleSelectPlace(item)}
              >
                <Icon name="location" size={18} color="#000" />

                <Text style={styles.placeText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* BOTTOM CARD */}

      <View style={styles.bottomCard}>
        {/* DRAG LINE */}

        <View style={styles.dragLine} />

        {/* TITLE */}

        <Text style={styles.title}>Find a Ride</Text>

        {/* CURRENT LOCATION INPUT */}

        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={20} color="#000" />

          <TextInput
            value={currentLocation}
            editable={false}
            placeholder="Current Location"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>

        {/* DESTINATION INPUT */}

        <Pressable
          onPress={() =>
            navigation.navigate('SearchScreen', {
              location: currentLocation,
            })
          }
          style={styles.inputContainer}
        >
          <Icon name="navigate" size={22} color="#777" />
          <View
            pointerEvents="none"
            style={{
              flex: 1,
            }}
          >
            <TextInput
              value={destination}
              editable={false}
              placeholder="Enter Destination"
              placeholderTextColor="#666"
              style={styles.input}
            />
          </View>
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

  //================================================
  // SEARCH RESULTS
  //================================================

  searchContainer: {
    position: 'absolute',

    bottom: 220,

    width: '100%',

    paddingHorizontal: 20,
  },

  placeItem: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#fff',

    padding: 14,

    borderBottomWidth: 1,

    borderBottomColor: '#eee',
  },

  placeText: {
    flex: 1,

    marginLeft: 10,

    color: '#000',
  },

  //================================================
  // BOTTOM CARD
  //================================================

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

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: -3,
    },

    shadowOpacity: 0.1,

    shadowRadius: 10,

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
    flex: 1,
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
