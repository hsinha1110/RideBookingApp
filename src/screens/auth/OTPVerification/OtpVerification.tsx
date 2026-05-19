import React, { useState } from 'react';

import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { OtpInput } from 'react-native-otp-entry';

import { useDispatch } from 'react-redux';

import ButtonComp from '@/components/ButtonComp';

import HeaderComp from '@/components/HeaderComp';

import TextComp from '@/components/TextComp';

import WrapperContainer from '@/components/WrapperContainer';

import useStyles from './styles';

import { AppDispatch } from '@/redux/store';

import { sendOtpAsyncThunk, verifyOtpAsyncThunk } from '@/redux/thunk/thunk';

import { secureStorage } from '@/utils/secureStorage';

import { setAuthenticated, setUserType } from '@/redux/slices/authSlice';

import { STORAGE_KEYS } from '@/utils/secureStorage';

interface OTPVerificationProps {
  route: {
    params: {
      phoneNumber: string;

      userRole: 'rider' | 'driver';
    };
  };
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ route }) => {
  //================================================
  // PARAMS
  //================================================

  const { phoneNumber } = route.params;

  //================================================
  // STATES
  //================================================

  const [otp, setOtp] = useState('');

  //================================================
  // HOOKS
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  const styles = useStyles();

  //================================================
  // VERIFY OTP
  //================================================

  const handleContinue = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter valid OTP');

      return;
    }

    try {
      const payload = {
        phoneNumber,
        otp,
      };

      const response: any = await dispatch(
        verifyOtpAsyncThunk(payload),
      ).unwrap();

      console.log(JSON.stringify(response, null, 2));

      //================================================
      // TOKEN
      //================================================

      const token = response?.token || response?.data?.token;

      //================================================
      // USER TYPE
      //================================================

      const userType =
        response?.user?.userType ||
        response?.data?.user?.userType ||
        response?.userType ||
        response?.data?.userType ||
        route.params.userRole;

      console.log('FINAL USER TYPE =>', userType);

      //================================================
      // SAVE TOKEN
      //================================================

      if (token) {
        await secureStorage.setItem('AUTH_TOKEN', token);
      }

      //================================================
      // SAVE USER TYPE
      //================================================

      if (userType) {
        await secureStorage.setItem('USER_TYPE', userType);

        dispatch(setUserType(userType));
      }

      //================================================
      // AUTH SUCCESS
      //================================================

      dispatch(setAuthenticated(true));

      //================================================
      // CHECK SAVED VALUE
      //================================================

      const savedUserType = await secureStorage.getItem('USER_TYPE');

      console.log('SAVED USER TYPE =>', savedUserType);

      Alert.alert('Success', response?.message || 'OTP verified');
    } catch (error: any) {
      console.log(error);

      Alert.alert('Error', error?.message || 'Invalid OTP');
    }
  };

  //================================================
  // RESEND OTP
  //================================================

  const handleResendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number is missing');

      return;
    }

    try {
      const response: any = await dispatch(
        sendOtpAsyncThunk({
          phoneNumber,
        }),
      ).unwrap();

      console.log(response, '======= RESEND OTP SUCCESS =======');

      Alert.alert('Success', response?.message || 'OTP resent successfully');
    } catch (error: any) {
      console.log(error, '======= RESEND OTP ERROR =======');

      Alert.alert('Error', error?.message || 'Failed to resend OTP');
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <HeaderComp showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* TITLE */}

            <View style={styles.titleSection}>
              <TextComp text="OTP Verification" style={styles.title} />

              <TextComp
                text={`OTP sent to ${phoneNumber}`}
                style={styles.subtitle}
              />
            </View>

            {/* OTP INPUT */}

            <View style={styles.otpSection}>
              <OtpInput
                numberOfDigits={6}
                onTextChange={setOtp}
                autoFocus
                theme={{
                  containerStyle: styles.otpContainer,

                  pinCodeContainerStyle: styles.otpField,

                  pinCodeTextStyle: styles.otpText,
                }}
              />
            </View>

            {/* BUTTON */}

            <View style={styles.buttonSection}>
              <TextComp
                text="Resend OTP"
                style={styles.resendText}
                onPress={handleResendOTP}
              />

              <ButtonComp
                title="Continue"
                onPress={handleContinue}
                disabled={otp.length !== 6}
                style={styles.continueButton}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default OTPVerification;
