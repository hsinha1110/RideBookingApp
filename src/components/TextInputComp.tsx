import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

interface TextInputCompProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: boolean;
  touched?: boolean;
  placeholder?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const TextInputComp: React.FC<TextInputCompProps> = ({
  containerStyle,
  inputStyle,
  error,
  touched,
  placeholder,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        error && touched && styles.errorContainer,
        containerStyle,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          error && touched && styles.errorInput,
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...props}
      />

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: moderateScale(7),
    padding: moderateScale(14),
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(14),
    color: '#000',
    padding: 0,
    margin: 0,
    textAlign: 'left',
  },

  errorContainer: {
    borderColor: 'red',
  },

  errorInput: {
    color: 'red',
  },
});

export default React.memo(TextInputComp);
