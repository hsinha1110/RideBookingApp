import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const MyTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { options } = descriptors[route.key];

        const icon = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? '#000' : '#8E8E93',
              size: 24,
            })
          : null;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
          >
            {icon}

            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? '#000' : '#8E8E93',
                },
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default React.memo(MyTabBar);
