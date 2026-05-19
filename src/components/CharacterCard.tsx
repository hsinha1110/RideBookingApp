import React, { useCallback } from 'react';
import { Pressable, View, StyleSheet, Dimensions, Image } from 'react-native';

import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import TextComp from './TextComp';

import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { commonColors } from '@/styles/colors';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

interface CharacterCardProps {
  item: Character;
  index: number;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

const CARD_MARGIN = moderateScale(4);
const CARD_WIDTH = (width - moderateScale(20) - CARD_MARGIN * 2) / 2;

const CharacterCard: React.FC<CharacterCardProps> = ({
  item,
  index,
  onPress,
}) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return commonColors.success;
      case 'dead':
        return commonColors.error;
      default:
        return commonColors.warning;
    }
  }, []);

  return (
    <Animated.View
      style={styles.card}
      entering={FadeInDown.delay((index % 20) * 100).springify()}
      exiting={FadeOut}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <TextComp text={item.status} style={styles.statusText} />
        </View>

        <View style={styles.content}>
          <TextComp text={item.name} style={styles.name} numberOfLines={1} />

          <TextComp text={item.species} style={styles.text} numberOfLines={1} />

          <TextComp
            text={item.origin.name}
            style={styles.text}
            numberOfLines={1}
          />

          <TextComp
            text={item.location.name}
            style={styles.text}
            numberOfLines={1}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  pressable: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    resizeMode: 'cover',
  },

  content: {
    padding: moderateScale(10),
  },

  name: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.bold,
    color: '#000',
    marginBottom: moderateScale(6),
  },

  text: {
    fontSize: moderateScale(12),
    fontFamily: fontFamily.regular,
    color: '#555',
    marginBottom: moderateScale(2),
  },

  statusBadge: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(12),

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },

  statusText: {
    fontSize: moderateScale(10),
    fontFamily: fontFamily.medium,
    color: '#000',
  },
});

export default CharacterCard;
