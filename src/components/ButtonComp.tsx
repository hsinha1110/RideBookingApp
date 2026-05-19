import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  DimensionValue,
  View,
} from 'react-native';

import TextComp from './TextComp';
import { moderateScale } from '@/styles/scaling';
import fontFamily from '@/styles/fontFamily';
import { commonColors } from '@/styles/colors';

interface ButtonCompProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  width?: DimensionValue;
  height?: DimensionValue;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconSize?: number;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  onPress,
  title,
  disabled = false,
  style,
  textStyle,
  width = '100%',
  height = 48,
  leftIcon,
  rightIcon,
  iconSize = 24,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        { width, height },
        disabled && styles.disabled,
        style,
      ]}
    >
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

      <TextComp
        text={title}
        style={[styles.text, disabled && styles.disabledText, textStyle]}
      />

      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: commonColors.black,
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(8),
  },

  text: {
    color: commonColors.white,
    fontSize: moderateScale(16),
    fontFamily: fontFamily.medium,
    fontWeight: 'bold',
  },

  disabled: {
    backgroundColor: '#ccc',
  },

  disabledText: {
    color: '#888',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ButtonComp;
