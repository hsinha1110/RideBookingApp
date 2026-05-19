import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import fontFamily from '@/styles/fontFamily';

interface TextCompProps extends TextProps {
  text?: string;
  style?: any;
  children?: React.ReactNode;
}

const TextComp: React.FC<TextCompProps> = ({
  text,
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {text ? text : children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(14),
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
});

export default React.memo(TextComp);
