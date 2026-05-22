import React, { FC, useEffect, useState } from 'react';
import FastImage from '@d11/react-native-fast-image';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';

import { allRiderRidesAsyncThunk } from '@/redux/thunk/thunk';

//================================================
// SCREEN
//================================================

const ProfileScreen: FC = () => {
  //================================================
  // STATES
  //================================================

  const [selectedTab, setSelectedTab] = useState<'current' | 'past'>('current');

  //================================================
  // DISPATCH
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // REDUX
  //================================================

  const { riderRides = [], loading } = useSelector(
    (state: RootState) => state.auth,
  );

  //================================================
  // API CALL
  //================================================

  useEffect(() => {
    dispatch(allRiderRidesAsyncThunk(selectedTab));
  }, [dispatch, selectedTab]);

  //================================================
  // DATA
  //================================================

  const data = riderRides || [];

  //================================================
  // RENDER ITEM
  //================================================

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        {/* TOP */}

        <View style={styles.topRow}>
          {/* IMAGE */}

          <FastImage
            source={{
              uri: 'https://i.pravatar.cc/300?img=12',
            }}
            style={styles.profileImage}
          />

          {/* DETAILS */}

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >
            <Text style={styles.name}>
              {item?.driver?.fullName || 'Driver'}
            </Text>

            <Text style={styles.rating}>⭐ 4.9</Text>
          </View>

          {/* PRICE */}

          <Text style={styles.price}>₹{item?.fare || 0}</Text>
        </View>

        {/* PICKUP */}

        <View style={styles.locationRow}>
          <View style={styles.greenDot} />

          <Text style={styles.locationText} numberOfLines={1}>
            {item?.pickupLocation?.address}
          </Text>
        </View>

        {/* DESTINATION */}

        <View style={styles.locationRow}>
          <View style={styles.redDot} />

          <Text style={styles.locationText} numberOfLines={1}>
            {item?.destinationLocation?.address}
          </Text>
        </View>

        {/* STATUS */}

        <View
          style={{
            marginTop: 14,
          }}
        >
          <Text
            style={{
              fontSize: 13,

              fontWeight: '600',

              color:
                item?.status === 'completed'
                  ? 'green'
                  : item?.status === 'cancelled'
                  ? 'red'
                  : '#FF9800',
            }}
          >
            {item?.status?.toUpperCase()}
          </Text>
        </View>

        {/* BOTTOM */}

        <View style={styles.bottomRow}>
          <Text style={styles.carText}>Swift Dzire • MP09AB1234</Text>

          <Text style={styles.dateText}>
            {new Date(item?.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  //================================================
  // UI
  //================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <Text style={styles.header}>My Rides</Text>

      {/* TABS */}

      <View style={styles.tabContainer}>
        {/* CURRENT */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSelectedTab('current');
          }}
          style={[
            styles.tabButton,
            {
              backgroundColor: selectedTab === 'current' ? 'black' : '#F3F3F3',
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === 'current' ? '#fff' : '#000',
              },
            ]}
          >
            Current
          </Text>
        </TouchableOpacity>

        {/* PAST */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSelectedTab('past');
          }}
          style={[
            styles.tabButton,
            {
              backgroundColor: selectedTab === 'past' ? 'green' : '#F3F3F3',
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === 'past' ? '#fff' : '#000',
              },
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOADER */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{
            marginTop: 50,
          }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No rides found</Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

//================================================
// STYLES
//================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',

    paddingHorizontal: 20,
  },

  header: {
    fontSize: 28,

    fontWeight: '700',

    color: '#000',

    marginTop: 20,

    marginBottom: 20,
  },

  tabContainer: {
    flexDirection: 'row',

    backgroundColor: '#F3F3F3',

    borderRadius: 14,

    padding: 4,

    marginBottom: 20,
  },

  tabButton: {
    flex: 1,

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',
  },

  tabText: {
    fontSize: 14,

    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',

    borderRadius: 18,

    padding: 16,

    marginBottom: 16,

    elevation: 4,

    shadowColor: '#000',

    shadowOpacity: 0.1,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  topRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  profileImage: {
    width: 55,

    height: 55,

    borderRadius: 100,
  },

  name: {
    fontSize: 16,

    fontWeight: '700',

    color: '#000',
  },

  rating: {
    fontSize: 13,

    color: '#777',

    marginTop: 2,
  },

  price: {
    fontSize: 18,

    fontWeight: '700',

    color: 'green',
  },

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 14,
  },

  greenDot: {
    width: 10,

    height: 10,

    borderRadius: 100,

    backgroundColor: 'green',

    marginRight: 10,
  },

  redDot: {
    width: 10,

    height: 10,

    borderRadius: 100,

    backgroundColor: 'red',

    marginRight: 10,
  },

  locationText: {
    flex: 1,

    fontSize: 14,

    color: '#333',
  },

  bottomRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 18,
  },

  carText: {
    fontSize: 12,

    color: '#666',
  },

  dateText: {
    fontSize: 12,

    color: '#666',
  },

  emptyContainer: {
    alignItems: 'center',

    marginTop: 100,
  },

  emptyText: {
    fontSize: 16,

    color: '#777',
  },
});
