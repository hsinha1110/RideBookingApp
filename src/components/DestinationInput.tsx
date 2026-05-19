import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import { NavigationProp } from '@/screens/types';

type Props = {
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };

  destination: string;
};

const DestinationInput: React.FC<Props> = ({
  currentLocation,
  destination,
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('SearchScreen', {
          location: currentLocation,
        })
      }
      style={styles.inputContainer}
    >
      <Icon name="navigate" size={22} color="#777" />

      <View style={styles.inputWrapper} pointerEvents="none">
        <TextInput
          value={destination}
          editable={false}
          placeholder="Enter Destination"
          placeholderTextColor="#666"
          style={styles.input}
        />
      </View>
    </Pressable>
  );
};

export default DestinationInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 55,
    gap: 10,
  },

  inputWrapper: {
    flex: 1,
  },

  input: {
    fontSize: 16,
    color: '#000',
  },
});
