import React, { FC, useState } from 'react';

import { View, TouchableOpacity, Alert } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

import { AuthStackParamList } from '@/screens/types';

import WrapperContainer from '@/components/WrapperContainer';
import ButtonComp from '@/components/ButtonComp';
import TextInputComp from '@/components/TextInputComp';
import TextComp from '@/components/TextComp';
import RoleTabs from '@/components/RolesTab';

import useStyles from './styles';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { loginAsyncThunk } from '@/redux/thunk/thunk';

const Login: FC = () => {
  //================ STATES =================

  const [phoneNumber, setPhoneNumber] = useState('');

  const [selectedRole, setSelectedRole] = useState<'rider' | 'driver'>('rider');

  //================ HOOKS =================

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const styles = useStyles();

  //================ HANDLE LOGIN =================
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');

      return;
    }

    try {
      const payload = {
        phoneNumber,
      };

      const response = await dispatch(loginAsyncThunk(payload)).unwrap();
      console.log(response, '======= LOGIN SUCCESS =======');
      navigation.navigate('OTPVerification', {
        phoneNumber,
        userRole: selectedRole,
      });
      Alert.alert('Success', response?.message || 'Login Successful');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'An error occurred during login. Please try again.',
      );
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.titleSection}>
          <TextComp
            text={selectedRole === 'rider' ? 'Welcome Rider' : 'Welcome Driver'}
            style={styles.welcomeText}
          />

          <TextComp text="Login to continue" style={styles.loginText} />
        </View>

        {/* Role Tabs */}

        <RoleTabs selectedRole={selectedRole} onChangeRole={setSelectedRole} />

        {/* Phone Input */}

        <TextInputComp
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          containerStyle={styles.input}
        />

        {/* Login Button */}

        <ButtonComp
          title={
            selectedRole === 'rider' ? 'Login as Rider' : 'Login as Driver'
          }
          onPress={handleLogin}
        />

        {/* Bottom Text */}

        <View style={styles.bottomContainer}>
          <TextComp text="Don't have an account?" style={styles.bottomText} />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Signup')}
          >
            <TextComp text=" Sign up" style={styles.signupText} />
          </TouchableOpacity>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default Login;
