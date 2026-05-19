import React from 'react';

import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { BackArrowIcon } from '@/assets/icons';

import TextComp from '@/components/TextComp';

import fontFamily from '@/styles/fontFamily';

import { moderateScale } from '@/styles/scaling';

interface HeaderCompProps {
  title?: string;
  showBack?: boolean;
  customStyle?: object;
}

const HeaderComp: React.FC<HeaderCompProps> = ({
  title,
  showBack = true,
  customStyle,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, customStyle]}>
      {showBack ? (
        <TouchableOpacity
          onPress={handleBackPress}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <BackArrowIcon />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      {title ? <TextComp text={title} style={styles.titleText} /> : <View />}

      <View style={{ width: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: moderateScale(16),
  },

  titleText: {
    fontSize: moderateScale(18),
    fontFamily: fontFamily.medium,
  },
});

export default HeaderComp;
