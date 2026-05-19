import React, { FC, useState } from 'react';

import { View, Alert } from 'react-native';

import { useDispatch } from 'react-redux';

import WrapperContainer from '@/components/WrapperContainer';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import ButtonComp from '@/components/ButtonComp';
import RoleTabs from '@/components/RolesTab';

import useStyles from '@/screens/auth/Signup/styles';

import { signUpAsyncThunk } from '@/redux/thunk/thunk';

import { AppDispatch } from '@/redux/store';

const Signup: FC = () => {
  const styles = useStyles();

  const dispatch = useDispatch<AppDispatch>();

  //================ STATES =================

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');

  const [password, setPassword] = useState('');

  const [userType, setUserType] = useState<'rider' | 'driver'>('rider');

  const [carName, setCarName] = useState('');

  const [carNumber, setCarNumber] = useState('');

  const [carModel, setCarModel] = useState('');

  const [loading, setLoading] = useState(false);

  //================ SIGNUP =================

  const handleSignup = async () => {
    if (!fullName || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');

      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName,
        email,
        phoneNumber,
        password,
        userType,
        carName,
        carNumber,
        carModel,
      };

      console.log(payload, '======= SIGNUP PAYLOAD =======');

      const response = await dispatch(signUpAsyncThunk(payload)).unwrap();

      console.log(response, '======= SIGNUP SUCCESS =======');

      Alert.alert('Success', response?.message || 'Signup Successful');
    } catch (error: any) {
      console.log(error, '======= SIGNUP ERROR =======');

      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.titleSection}>
          <TextComp text="Create Account" style={styles.createText} />

          <TextComp text="Signup to continue" style={styles.signupText} />
        </View>

        {/* Role Tabs */}

        <RoleTabs selectedRole={userType} onChangeRole={setUserType} />

        {/* Full Name */}

        <TextInputComp
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          containerStyle={styles.input}
        />

        {/* Email */}

        <TextInputComp
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.input}
        />

        {/* Phone */}

        <TextInputComp
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          containerStyle={styles.input}
        />

        {/* Password */}

        <TextInputComp
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          containerStyle={styles.input}
        />

        {/* Car Name */}

        {userType === 'driver' && (
          <>
            <TextInputComp
              placeholder="Car Name"
              value={carName}
              onChangeText={setCarName}
              containerStyle={styles.input}
            />

            <TextInputComp
              placeholder="Car Number"
              value={carNumber}
              onChangeText={setCarNumber}
              containerStyle={styles.input}
            />

            <TextInputComp
              placeholder="Car Model"
              value={carModel}
              onChangeText={setCarModel}
              containerStyle={styles.input}
            />
          </>
        )}

        {/* Button */}

        <ButtonComp
          title={
            loading
              ? 'Please wait...'
              : userType === 'rider'
              ? 'Signup as Rider'
              : 'Signup as Driver'
          }
          onPress={handleSignup}
          disabled={loading}
        />
      </View>
    </WrapperContainer>
  );
};

export default Signup;
