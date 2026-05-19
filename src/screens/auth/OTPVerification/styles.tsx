import { StyleSheet } from 'react-native';

import { commonColors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

const useStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: commonColors.white,
    },

    content: {
      paddingHorizontal: moderateScale(16),
      marginTop: moderateScale(24),
      justifyContent: 'space-between',
    },

    titleSection: {
      marginBottom: moderateScale(32),
    },

    title: {
      fontSize: moderateScale(22),
      fontFamily: fontFamily.bold,
      marginBottom: moderateScale(12),
      color: commonColors.black,
    },

    subtitle: {
      fontSize: moderateScale(14),
      fontFamily: fontFamily.medium,
      color: commonColors.gray500,
    },

    otpSection: {
      marginTop: moderateScale(32),
    },

    otpContainer: {
      alignItems: 'center',
      gap: moderateScale(10),
    },

    otpField: {
      width: moderateScale(50),
      height: moderateScale(55),

      borderWidth: 1,
      borderColor: commonColors.gray300,
      borderRadius: moderateScale(10),

      backgroundColor: commonColors.white,
    },

    otpText: {
      fontSize: moderateScale(22),
      fontFamily: fontFamily.bold,
      color: commonColors.black,
    },

    buttonSection: {
      marginBottom: moderateScale(24),
    },

    continueButton: {
      height: moderateScale(48),
      backgroundColor: commonColors.black,
    },

    resendText: {
      fontSize: moderateScale(14),
      fontFamily: fontFamily.medium,
      color: commonColors.gray500,
      textAlign: 'center',
      marginVertical: moderateScale(14),
    },
  });
};

export default useStyles;
