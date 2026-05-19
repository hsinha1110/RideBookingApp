import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { commonColors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: moderateScale(16),
        },

        content: {
          marginTop: moderateScale(20),
          justifyContent: 'space-between',
        },

        titleSection: {
          marginBottom: moderateScale(32),
        },

        signUpPrompt: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: moderateScale(6),
        },
        welcomeText: {
          fontSize: moderateScale(24),
          fontFamily: fontFamily.bold,
          fontWeight: 'bold',
        },
        loginText: {
          fontSize: moderateScale(16),
          fontFamily: fontFamily.bold,
          marginTop: moderateScale(5),
          fontWeight: 'bold',
          color: commonColors.gray300,
        },

        signUpLink: {
          fontSize: moderateScale(12),
          color: commonColors.secondary,
          fontFamily: fontFamily.medium,
          textDecorationLine: 'underline',
          letterSpacing: 0.5,
        },

        formSection: {
          marginBottom: moderateScale(24),
        },

        inputLabel: {
          fontSize: moderateScale(16),
          fontFamily: fontFamily.medium,
          marginBottom: moderateScale(10),
        },

        buttonSection: {
          marginBottom: moderateScale(24),
        },

        nextButton: {
          height: moderateScale(48),
          backgroundColor: commonColors.primary,
        },

        termsText: {
          fontSize: moderateScale(12),
          color: '#777',
          fontFamily: fontFamily.regular,
          textAlign: 'center',
        },

        header: {
          paddingHorizontal: 0,
        },
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
          backgroundColor: commonColors.primary,
        },

        tabText: {
          fontSize: moderateScale(14),
          fontFamily: fontFamily.medium,
        },

        input: {
          marginBottom: moderateScale(20),
        },

        bottomContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: moderateScale(24),
        },

        bottomText: {
          color: commonColors.gray500,
        },

        signupText: {
          color: commonColors.gray300,
          fontFamily: fontFamily.medium,
        },
      }),
    [],
  );
};

export default useStyles;
