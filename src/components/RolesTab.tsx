import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import TextComp from '@/components/TextComp';

import { commonColors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import fontFamily from '@/styles/fontFamily';

interface RoleTabsProps {
  selectedRole: 'rider' | 'driver';
  onChangeRole: (role: 'rider' | 'driver') => void;
}

const RoleTabs: React.FC<RoleTabsProps> = ({ selectedRole, onChangeRole }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tabButton, selectedRole === 'rider' && styles.activeTab]}
        onPress={() => onChangeRole('rider')}
      >
        <TextComp
          text="I'm a rider"
          style={[
            styles.tabText,
            {
              color:
                selectedRole === 'rider'
                  ? commonColors.white
                  : commonColors.gray500,
            },
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tabButton,
          selectedRole === 'driver' && styles.activeTab,
        ]}
        onPress={() => onChangeRole('driver')}
      >
        <TextComp
          text="I'm a driver"
          style={[
            styles.tabText,
            {
              color:
                selectedRole === 'driver'
                  ? commonColors.white
                  : commonColors.gray500,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(RoleTabs);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: moderateScale(10),
    padding: moderateScale(4),
    marginBottom: moderateScale(20),
  },

  tabButton: {
    flex: 1,
    height: moderateScale(42),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(8),
  },

  activeTab: {
    backgroundColor: commonColors.black,
  },

  tabText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.medium,
  },
});
