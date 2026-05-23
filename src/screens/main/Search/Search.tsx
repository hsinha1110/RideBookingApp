import React, { FC, useState } from 'react';

import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import { getAddressFromPlaceId, searchAddress } from '@/utils/services';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import ButtonComp from '@/components/ButtonComp';

const SearchScreen: FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { location, pickupAddress } = route.params;
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [pickup, setPickup] = useState(pickupAddress || '');
  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.trim().length < 2) {
      setLocations([]);
      return;
    }
    try {
      const response = await searchAddress(text);
      console.log('SEARCH RESPONSE =>', response);
      setLocations(response || []);
    } catch (error) {
      console.log('SEARCH ERROR =>', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* SEARCH BOX */}

      <View style={styles.searchBox}>
        <Icon name="location-outline" size={20} color="#000" />

        <TextInput
          value={pickup}
          onChangeText={setPickup}
          placeholder="Pickup Location"
          placeholderTextColor="#999"
          style={styles.input}
        />
        {search?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setLocations([]);
            }}
          >
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchBox}>
        <Icon name="navigate" size={22} color="#777" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search destination"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {search?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setLocations([]);
            }}
          >
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {/* CURRENT LOCATION */}

      {/* RECENT */}

      <Text style={styles.recentText}>Search Results</Text>

      {/* LIST */}

      <FlatList
        data={locations}
        keyExtractor={item => item.place_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.itemContainer}
            onPress={() => {
              setSelectedLocation(item);
              setSearch(item.description);
              setLocations([]);
            }}
          >
            {/* ICON */}
            <View style={styles.locationIcon}>
              <Icon name="navigate" size={22} color="#777" />
            </View>
            {/* TEXT */}
            <View style={styles.textContainer}>
              <Text style={styles.placeTitle}>
                {item.structured_formatting?.main_text || item.description}
              </Text>

              <Text style={styles.placeAddress}>
                {item.structured_formatting?.secondary_text}
              </Text>
            </View>
            {/* ARROW */}
            <Icon name="navigate" size={22} color="#777" />
          </TouchableOpacity>
        )}
      />
      <View style={styles.bottomContainer}>
        <ButtonComp
          style={{ height: 60 }}
          title="Confirm Location"
          onPress={async () => {
            try {
              if (!selectedLocation) return;
              const details = await getAddressFromPlaceId(
                selectedLocation.place_id,
              );
              const coords = details?.geometry?.location;
              if (!coords) return;
              navigation.navigate('RideConfirmation', {
                pickupLocation: pickupAddress,

                pickupCoords: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },

                destination: selectedLocation.description,

                destinationCoords: {
                  latitude: coords.lat,
                  longitude: coords.lng,
                },
              });
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  searchBox: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginHorizontal: 12,
    color: '#000',
    fontSize: 15,
  },
  currentLocationBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  currentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  currentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },

  currentSubTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  recentText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },

  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  placeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  placeAddress: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
});
