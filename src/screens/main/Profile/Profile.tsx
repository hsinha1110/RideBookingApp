//================================================
// PROFILE SCREEN
//================================================

import React, { FC, useEffect, useState } from 'react';

import FastImage from '@d11/react-native-fast-image';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import WrapperContainer from '@/components/WrapperContainer';

import RoleTabs from '@/components/RolesTab';

import { AppDispatch, RootState } from '@/redux/store';

import { allRiderRidesAsyncThunk } from '@/redux/thunk/thunk';

//================================================
// SCREEN
//================================================

const ProfileScreen: FC = () => {
  //================================================
  // STATES
  //================================================

  const [selectedRole, setSelectedRole] = useState<'rider' | 'driver'>('rider');

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
    dispatch(
      allRiderRidesAsyncThunk(selectedRole === 'rider' ? 'current' : 'past'),
    );
  }, [dispatch, selectedRole]);

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
              uri:
                item?.driver?.profileImage ||
                'https://i.pravatar.cc/300?img=12',
            }}
            style={styles.profileImage}
          />

          {/* DETAILS */}

          <View style={styles.userContainer}>
            <Text style={styles.name}>
              {item?.driver?.fullName || 'Driver'}
            </Text>

            <Text style={styles.rating}>⭐ {item?.driver?.rating || 4.9}</Text>
          </View>

          {/* PRICE */}

          <Text style={styles.price}>₹{item?.fare || 0}</Text>
        </View>

        {/* PICKUP */}

        <View style={styles.locationRow}>
          <View style={styles.greenDot} />

          <Text numberOfLines={1} style={styles.locationText}>
            {item?.pickupLocation?.address || 'Pickup Location'}
          </Text>
        </View>

        {/* DESTINATION */}

        <View style={styles.locationRow}>
          <View style={styles.redDot} />

          <Text numberOfLines={1} style={styles.locationText}>
            {item?.destinationLocation?.address || 'Destination Location'}
          </Text>
        </View>

        {/* STATUS */}

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item?.status === 'completed'
                    ? '#16A34A'
                    : item?.status === 'cancelled'
                    ? '#DC2626'
                    : '#F59E0B',
              },
            ]}
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
    <WrapperContainer edges={['top', 'bottom']} style={styles.container}>
      {/* HEADER */}

      <Text style={styles.header}>My Rides</Text>

      {/* ROLE TABS */}

      <RoleTabs
        selectedRole={selectedRole}
        onChangeRole={(role: any) => {
          setSelectedRole(role);
        }}
      />

      {/* LOADER */}

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No rides found</Text>
              </View>
            );
          }}
        />
      )}
    </WrapperContainer>
  );
};

export default ProfileScreen;

//================================================
// STYLES
//================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 20,
  },

  header: {
    fontSize: 30,

    fontWeight: '700',

    color: '#111827',

    marginTop: 20,

    marginBottom: 20,
  },

  loader: {
    marginTop: 80,
  },

  contentContainer: {
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 16,

    marginBottom: 18,

    shadowColor: '#000',

    shadowOpacity: 0.08,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  topRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  profileImage: {
    width: 58,

    height: 58,

    borderRadius: 100,
  },

  userContainer: {
    flex: 1,

    marginLeft: 14,
  },

  name: {
    fontSize: 16,

    fontWeight: '700',

    color: '#111827',
  },

  rating: {
    fontSize: 13,

    color: '#6B7280',

    marginTop: 3,
  },

  price: {
    fontSize: 20,

    fontWeight: '700',

    color: '#16A34A',
  },

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 16,
  },

  greenDot: {
    width: 10,

    height: 10,

    borderRadius: 100,

    backgroundColor: '#22C55E',

    marginRight: 10,
  },

  redDot: {
    width: 10,

    height: 10,

    borderRadius: 100,

    backgroundColor: '#EF4444',

    marginRight: 10,
  },

  locationText: {
    flex: 1,

    fontSize: 14,

    color: '#374151',
  },

  statusContainer: {
    marginTop: 18,
  },

  statusText: {
    fontSize: 13,

    fontWeight: '700',
  },

  bottomRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 18,

    borderTopWidth: 1,

    borderTopColor: '#F3F4F6',

    paddingTop: 14,
  },

  carText: {
    fontSize: 12,

    color: '#6B7280',
  },

  dateText: {
    fontSize: 12,

    color: '#6B7280',
  },

  emptyContainer: {
    alignItems: 'center',

    marginTop: 120,
  },

  emptyText: {
    fontSize: 16,

    color: '#9CA3AF',
  },
});
