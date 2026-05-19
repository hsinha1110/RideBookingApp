import React from 'react';

import { StatusBar, StyleSheet, ViewStyle } from 'react-native';

import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

interface WrapperContainerProps extends SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const WrapperContainer: React.FC<WrapperContainerProps> = ({
  children,
  style,
  ...safeAreaProps
}) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        style,
        {
          backgroundColor: '#FFFFFF',
        },
      ]}
      {...safeAreaProps}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(WrapperContainer);
